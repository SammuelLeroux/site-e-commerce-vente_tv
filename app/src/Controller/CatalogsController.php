<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Catalogs;
use Symfony\Component\Security\Http\Attribute\IsGranted;

use Symfony\Component\HttpFoundation\Request;


class CatalogsController extends AbstractController
{
    #[Route('/products', methods: ['GET'])]

    public function index(ManagerRegistry $doctrine): JsonResponse
    {
 
        $catalogs = $doctrine->getRepository(Catalogs::class)->findAll();

 
        // Construire un tableau associatif avec les propriétés accessibles de chaque objet
        $data = [];
        foreach ($catalogs as $catalog) {
            $data[] = [
                'id' => $catalog->getId(),
                'name' => $catalog->getName(),
                'description' => $catalog->getDescription(),
                'photo' => $catalog->getPhoto(),
                'price' => $catalog->getPrice(),
                'brand' => $catalog->getBrand(),
                'resolution' => $catalog->getResolution(),
                'size' => $catalog->getSize(),
                'technology' => $catalog->getTechnology(),
                'connectivity' => $catalog->getConnectivity(),
                'isSmartTV' => $catalog->isSmartTV(),
            ];
        }
 
        // Convertir le tableau associatif en JSON
        $jsonData = json_encode($data);
 
        // Retourner la réponse JSON
        return new JsonResponse($jsonData, 200, [], true);
    }

    #[Route('/products/{id}', name: 'get_product', methods: ['GET'])]
    public function getProduct(int $id, ManagerRegistry $doctrine): JsonResponse
    {
        $product = $doctrine->getRepository(Catalogs::class)->find($id);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], 404);
        }

        $productData = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'photo' => $product->getPhoto(),
            'price' => $product->getPrice(),
            'brand' => $product->getBrand(),
            'resolution' => $product->getResolution(),
            'size' => $product->getSize(),
            'technology' => $product->getTechnology(),
            'connectivity' => $product->getConnectivity(),
            'isSmartTV' => $product->isSmartTV(),
        ];

        return new JsonResponse($productData);
    }

    #[Route('/products', methods: ['POST'] )]
    #[IsGranted("ROLE_USER")]
    public function add(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
            $data = json_decode($request->getContent(), true);
        
            $catalog = new Catalogs();
        
            foreach ($data as $key => $value) {
                switch ($key) {
                    case 'name':
                        $catalog->setName($value);
                        break;
                    case 'description':
                        $catalog->setDescription($value);
                        break;
                    case 'photo':
                        $catalog->setPhoto($value);
                        break;
                    case 'price':
                        $catalog->setPrice($value);
                        break;
                    case 'brand':
                        $catalog->setBrand($value);
                        break;
                    case 'resolution':
                        $catalog->setResolution($value);
                        break;
                    case 'size':
                        $catalog->setSize($value);
                        break;
                    case 'technology':
                        $catalog->setTechnology($value);
                        break;
                    case 'connectivity':
                        $catalog->setConnectivity($value);
                        break;
                    case 'is_smart_tv':
                        $catalog->setSmartTV($value);
                        break;
                    default:
                        break;
                }
            }
        
            $entityManager->persist($catalog);
            $entityManager->flush();
        
            $catalogData = [
                'id' => $catalog->getId(),
                'name' => $catalog->getName(),
                'description' => $catalog->getDescription(),
                'photo' => $catalog->getPhoto(),
                'price' => $catalog->getPrice(),
                'brand' => $catalog->getBrand(),
                'resolution' => $catalog->getResolution(),
                'size' => $catalog->getSize(),
                'technology' => $catalog->getTechnology(),
                'connectivity' => $catalog->getConnectivity(),
                'is_smart_tv' => $catalog->isSmartTV(),
            ];
        
            return new JsonResponse([
                'message' => 'Catalog created!',
                'catalog' => $catalogData,
            ]);
        }
    
       // Update Product
       #[Route('/products/{id}', methods: ['PUT'])]
       #[IsGranted("ROLE_USER")]
    public function update(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $catalog = $entityManager->getRepository(Catalogs::class)->find($id);

        if (!$catalog) {
            return new JsonResponse(['error' => 'Catalog not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        foreach ($data as $key => $value) {
            switch ($key) {
                case 'name':
                    $catalog->setName($value);
                    break;
                case 'description':
                    $catalog->setDescription($value);
                    break;
                case 'photo':
                    $catalog->setPhoto($value);
                    break;
                case 'price':
                    $catalog->setPrice($value);
                    break;
                case 'brand':
                    $catalog->setBrand($value);
                    break;
                case 'resolution':
                    $catalog->setResolution($value);
                    break;
                case 'size':
                    $catalog->setSize($value);
                    break;
                case 'technology':
                    $catalog->setTechnology($value);
                    break;
                case 'connectivity':
                    $catalog->setConnectivity($value);
                    break;
                case 'is_smart_tv':
                    $catalog->setSmartTV($value);
                    break;
                default:
                    // Ignore unknown keys
                    break;
            }
        }

        $entityManager->flush();

        $message = 'Catalog updated!';

        // Construire manuellement le tableau de données du catalogue
        $catalogData = [
            'id' => $catalog->getId(),
            'name' => $catalog->getName(),
            'description' => $catalog->getDescription(),
            'photo' => $catalog->getPhoto(),
            'price' => $catalog->getPrice(),
            'brand' => $catalog->getBrand(),
            'resolution' => $catalog->getResolution(),
            'size' => $catalog->getSize(),
            'technology' => $catalog->getTechnology(),
            'connectivity' => $catalog->getConnectivity(),
            'is_smart_tv' => $catalog->isSmartTV(),
        ];

        return new JsonResponse([
            'message' => $message,
            'catalog' => $catalogData,
        ], 200);
    }
       
       
    //Delete Product
    #[Route('/products/{productId}' , methods: ['DELETE'])]
    #[IsGranted("ROLE_USER")]
    public function delete(EntityManagerInterface $entityManager, int $productId): JsonResponse
    {
        $catalog = $entityManager->getRepository(Catalogs::class)->find($productId);

        if (!$catalog) {
            return $this->json([
                'error' => 'Catalog not found',
            ], 404);
        }

        $entityManager->remove($catalog);
        $entityManager->flush();

        return $this->json([
            'message' => 'Catalog deleted!',
        ]);
    }

    #[Route('/api/product/category', methods: ['GET'])]
    #[IsGranted("ROLE_USER")] // Assurez-vous que l'utilisateur est authentifié si nécessaire
    public function searchByCategory(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérez les paramètres de requête pour les catégories
        $brand = $request->query->get('brand');
        $resolution = $request->query->get('resolution');
        $size = $request->query->get('size');
        $technology = $request->query->get('technology');
        $connectivity = $request->query->get('connectivity');
        $smartTV = $request->query->get('smartTV');

        // Créez un tableau associatif contenant les catégories et leurs valeurs
        $categories = [
            'brand' => $brand,
            'resolution' => $resolution,
            'size' => $size,
            'technology' => $technology,
            'connectivity' => $connectivity,
            'smartTV' => $smartTV,
        ];

        // Initialisez un tableau vide pour stocker les produits correspondants
        $matchingProducts = [];

        // Recherchez les produits en fonction des catégories fournies
        foreach ($categories as $category => $value) {
            if ($value !== null) {
                // Utilisez la méthode findBy pour rechercher les produits correspondant à la catégorie spécifiée
                $products = $entityManager->getRepository(Catalogs::class)->findBy([$category => $value]);

                // Ajoutez les produits correspondants au tableau des produits correspondants
                foreach ($products as $product) {
                    $matchingProducts[] = [
                        'id' => $product->getId(),
                        'name' => $product->getName(),
                        'description' => $product->getDescription(),
                        'photo' => $product->getPhoto(),
                        'price' => $product->getPrice(),
                        'brand' => $product->getBrand(),
                        'resolution' => $product->getResolution(),
                        'size' => $product->getSize(),
                        'technology' => $product->getTechnology(),
                        'connectivity' => $product->getConnectivity(),
                        'smartTV' => $product->isSmartTV(),
                    ];
                }
            }
        }

        // Retournez les produits correspondants sous forme de réponse JSON
        return $this->json($matchingProducts);
    }
}