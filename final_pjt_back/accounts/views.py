from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import CustomRegisterSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def signup(request):
    if request.method == 'GET':
        return Response({
            'message': '회원가입 페이지입니다.',
            'required_fields': {
                'username': '사용자 이름',
                'email': '이메일',
                'password1': '비밀번호',
                'password2': '비밀번호 확인',
                'name': '이름',
                'birth_date': '생년월일',
                'gender': '성별',
                'income_level': '소득 수준',
                'terms_agreement': '이용약관 동의',
                'privacy_agreement': '개인정보 처리방침 동의'
            }
        })
    
    # POST 요청 처리
    try:
         # username 중복 검사
        username = request.data.get('username')
        if get_user_model().objects.filter(username=username).exists():
            return Response(
                {'error': '이미 사용 중인 아이디입니다.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 이메일 중복 검사
        email = request.data.get('email')
        if get_user_model().objects.filter(email=email).exists():
            return Response(
                {'error': '이미 등록된 이메일입니다.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = CustomRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            
            # JWT 토큰 생성
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': '회원가입이 완료되었습니다.',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                    'member_type': user.member_type,
                },
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': '아이디와 비밀번호를 모두 입력해주세요.'}, 
                      status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username
        })
    else:
        return Response({'error': '아이디 또는 비밀번호가 잘못되었습니다.'}, 
                      status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'error': '인증되지 않은 사용자입니다.'}, 
                      status=status.HTTP_401_UNAUTHORIZED)
    
    # 사용자의 토큰 삭제
    Token.objects.filter(user=user).delete()
    
    return Response({'message': '로그아웃되었습니다.'}, 
                  status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'error': '인증되지 않은 사용자입니다.'}, 
                      status=status.HTTP_401_UNAUTHORIZED)
    
    # 토큰 삭제
    Token.objects.filter(user=user).delete()
    # 사용자 삭제
    user.delete()
    
    return Response({'message': '계정이 성공적으로 삭제되었습니다.'}, 
                  status=status.HTTP_204_NO_CONTENT)


