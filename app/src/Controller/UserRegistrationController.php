<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRegistrationController extends AbstractController
{

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        
        $login = $request->get('login');
        $email = $request->get('email');
        $firstname = $request->get('firstname');
        $lastname = $request->get('lastname');
        $password = $request->get('password');

        $user = new Users();
        $user -> setEmail($email);
        $user -> setFirstname($firstname);
        $user -> setLastname($lastname);
        $user -> setLogin($login);
        $user -> setRoles(['ROLE_USER']);
        //$user -> setPassword('ChangeMe!');
        $user -> setPassword($passwordHasher->hashPassword($user,$password));
        $entityManager->persist($user);
        $entityManager->flush();

        // to update user password hashing with after creating id
        // $userRepository = $entityManager->getRepository(Users::class);
        // $RegisteredUser = $userRepository->findOneBy(['email' => $email]);
        // $hashedPassword = $passwordHasher->hashPassword($RegisteredUser,$password);
        // $RegisteredUser -> setPassword($hashedPassword);
        // $userRepository->upgradePassword($RegisteredUser, $hashedPassword);

        return $this->json([
            'User' => 'User registered successfully',
        ]);
    }
}
