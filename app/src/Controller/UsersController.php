<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\Users;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsersController extends AbstractController
{

    #[Route('/users', name: 'show_user', methods: ['GET'])]
    #[IsGranted("ROLE_USER")]
    public function showCurrentUser(): JsonResponse
    {
        $user = $this->getUser();
        
        if ($user instanceof Users) {
            $userData = [
                'login' => $user->getLogin(),
                'email' => $user->getEmail(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'role' => $user->getRoles(),
            ];
        } else {
            return new JsonResponse(['error' => 'User is not connected properly!'], 401);
        }

        return new JsonResponse(['user' => $userData], 200);
    }

    #[Route('/users', name: 'update_user', methods: ['PUT'])]
    #[IsGranted("ROLE_USER")]
    public function updateCurrentUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $user = $this->getUser();
        
        if ($user instanceof Users) {
            if($request->get('email') === $user->getEmail()){

                $login = $request->get('login');
                $firstname = $request->get('firstname');
                $lastname = $request->get('lastname');
                $oldpassword = $request->get('oldpassword');
                $newpassword = $request->get('newpassword');

                $userRepository = $entityManager->getRepository(Users::class);
                $FoundUser = $userRepository->findOneBy(['email' => $request->get('email')]);
                if (!$FoundUser) {
                    // Code 401 "Unauthorized"
                    return new JsonResponse(['error' => 'User do not exists!'], 401);
                }

                $isOldPasswordValid = $passwordHasher->isPasswordValid($FoundUser, $oldpassword);
                if (!$isOldPasswordValid) {
                    // Code 401 "Unauthorized"
                    return new JsonResponse(['error' => 'The old password is not correct!'], 401);
                }
                
                $user->setLogin($login);
                $user->setFirstname($firstname);
                $user->setLastname($lastname);
                $user -> setPassword($passwordHasher->hashPassword($user, $newpassword));
                
                $entityManager->persist($user);
                $entityManager->flush();
                
                $userData = [
                    'login' => $user->getLogin(),
                    'email' => $user->getEmail(),
                    'firstname' => $user->getFirstname(),
                    'lastname' => $user->getLastname(),
                ];
            }else{
                return new JsonResponse(['error' => 'Email is not correct!'], 400);
            }
        } else {
            return new JsonResponse(['error' => 'User is not connected properly!'], 401);
        }

        return new JsonResponse(['user' => $userData, 'message' => 'user updated successfully!'], 200);
    }
}
