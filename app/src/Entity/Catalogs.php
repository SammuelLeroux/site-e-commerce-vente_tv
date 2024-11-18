<?php

namespace App\Entity;

use App\Repository\CatalogsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CatalogsRepository::class)]
class Catalogs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $photo = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column(length: 255)]
    private ?string $brand = null;

    #[ORM\Column(length: 255)]
    private ?string $resolution = null;

    #[ORM\Column(length: 255)]
    private ?string $size = null;

    #[ORM\Column(length: 255)]
    private ?string $technology = null;

    #[ORM\Column(length: 255)]
    private ?string $connectivity = null;

    #[ORM\Column]
    private ?bool $isSmartTV = null;

    /**
     * @var Collection<int, ToOrder>
     */
    #[ORM\OneToMany(targetEntity: ToOrder::class, mappedBy: 'idCatalogs')]
    private Collection $toOrders;

    public function __construct()
    {
        $this->toOrders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): static
    {
        $this->brand = $brand;

        return $this;
    }

    public function getResolution(): ?string
    {
        return $this->resolution;
    }

    public function setResolution(string $resolution): static
    {
        $this->resolution = $resolution;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getTechnology(): ?string
    {
        return $this->technology;
    }

    public function setTechnology(string $technology): static
    {
        $this->technology = $technology;

        return $this;
    }

    public function getConnectivity(): ?string
    {
        return $this->connectivity;
    }

    public function setConnectivity(string $connectivity): static
    {
        $this->connectivity = $connectivity;

        return $this;
    }

    public function isSmartTV(): ?bool
    {
        return $this->isSmartTV;
    }

    public function setSmartTV(bool $isSmartTV): static
    {
        $this->isSmartTV = $isSmartTV;

        return $this;
    }

    /**
     * @return Collection<int, ToOrder>
     */
    public function getToOrders(): Collection
    {
        return $this->toOrders;
    }

    public function addToOrder(ToOrder $toOrder): static
    {
        if (!$this->toOrders->contains($toOrder)) {
            $this->toOrders->add($toOrder);
            $toOrder->setIdCatalogs($this);
        }

        return $this;
    }

    public function removeToOrder(ToOrder $toOrder): static
    {
        if ($this->toOrders->removeElement($toOrder)) {
            // set the owning side to null (unless already changed)
            if ($toOrder->getIdCatalogs() === $this) {
                $toOrder->setIdCatalogs(null);
            }
        }

        return $this;
    }
}
