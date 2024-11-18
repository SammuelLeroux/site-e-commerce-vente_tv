<?php

namespace App\Repository;

use App\Entity\ToOrder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ToOrder>
 *
 * @method ToOrder|null find($id, $lockMode = null, $lockVersion = null)
 * @method ToOrder|null findOneBy(array $criteria, array $orderBy = null)
 * @method ToOrder[]    findAll()
 * @method ToOrder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ToOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ToOrder::class);
    }

    //    /**
    //     * @return ToOrder[] Returns an array of ToOrder objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ToOrder
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
