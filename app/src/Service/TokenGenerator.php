<?php

namespace App\Service;

use DateTimeImmutable;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\JwtFacade;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;

class TokenGenerator
{
    private $key;

    public function __construct($jwtSecret)
    {
        $this->key = InMemory::base64Encoded($jwtSecret);
    }

    public function generateToken(): string
    {
        $token = (new JwtFacade())->issue(
            new Sha256(),
            $this->key,
            static fn (
                Builder $builder,
            ): Builder => $builder
                ->issuedBy('*')
                ->permittedFor('*')
        );

        // Return the token as a string
        return (string) $token->toString();
    }

    public function isTokenExpired(string $token): bool
    {

        $parser = new Parser(new JoseEncoder());
        $jwt = $parser->parse($token);
        try {
            /** @var Plain $jwt */

            $claims = $jwt->claims();

            // Retrieve the 'exp' claim
            $createdTime = $claims->get('iat');

            if ($createdTime instanceof DateTimeImmutable) {
                // Calculate the difference between the expiration datetime and the current datetime
                $currentTime = new DateTimeImmutable();
                $difference = $currentTime->getTimestamp() - $createdTime->getTimestamp();

                // If the difference is less than 60 minutes (3600 seconds), return false
                if ($difference < 3600) {
                    return false;
                }
            }
    
            // Token is expired
            return true;
        } catch (CannotDecodeContent | InvalidTokenStructure | UnsupportedHeaderFound  $e) {
            // Token is invalid
            return true;
        }
    }
}