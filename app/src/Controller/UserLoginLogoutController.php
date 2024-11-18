<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\TokenGenerator;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserLoginLogoutController extends AbstractController
{
    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, TokenGenerator $tokenGenerator): JsonResponse
    {

        $email = $request->get('email');
        if (null === $email) {
            // Code 401 "Unauthorized"
            return new JsonResponse(['error' => 'No email provided!'], 401);
        }

        $userRepository = $entityManager->getRepository(Users::class);
        $user = $userRepository->findOneBy(['email' => $email]);
        if (null === $user) {
            // Code 401 "Unauthorized"
            return new JsonResponse(['error' => 'User does not exist!'], 401);
        }
        
        $isPasswordValid = $passwordHasher->isPasswordValid($user, $request->get('password'));
        if (!$isPasswordValid) {
            // Code 401 "Unauthorized"
            return new JsonResponse(['error' => 'The password is not correct!'], 401);
        }

        $generatedToken = $tokenGenerator->generateToken();
        $user->setApiToken($generatedToken);
        $entityManager->persist($user);
        $entityManager->flush();

        $userData = [
            'login' => $user->getLogin(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'roles' => $user->getRoles(),
        ];
 
        return $this->json([
            'token' => $generatedToken,
            'user' => $userData
        ]);
    }

    #[Route('/logout', name: 'app_logout', methods: ['POST'])]
    #[IsGranted("ROLE_USER")]
    public function logout(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $email = $request->get('email');
        if (null === $email) {
            return new JsonResponse(['error' => 'No email provided!'], 400);
        }
        $userRepository = $entityManager->getRepository(Users::class);
        $user = $userRepository->findOneBy(['email' => $email]);
        if (null === $user) {
            return new JsonResponse(['error' => 'User does not exist!'], 400);
        }

        $user->setApiToken('');
        $entityManager->persist($user);
        $entityManager->flush();


        return $this->json([
            'Logout' => 'user is logout!',
        ]);
    }
}