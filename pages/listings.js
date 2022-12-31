import React, { useState } from "react";
import {
  useContract,
  useActiveListings,
  useContractMetadata,
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import { 
  Link, Card, CardHeader, CardBody, CardFooter, Divider, Container, Spinner
  } from '@chakra-ui/react'
import { MARKETPLACE_ADDRESS } from "../const/contractAddresses";
import Banner from "../components/hero";
import styles from "../styles/Theme.module.css";

export default function Listings() {
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS);
  const { data: listings, isLoading } = useActiveListings(marketplace);

  // Load contract metadata
  const { data: contractMetadata, isLoading: loadingMetadata } =
    useContractMetadata(marketplace);

  const [filter, setFilter] = useState(0); // 0 = direct, auction = 1

  return (
    <Container centerContent>
      <div className={styles.collectionContainer}>
        <div className={styles.detailPageContainer}>
          {!loadingMetadata ? (
            <>
              <h1>{contractMetadata?.name}</h1>
              <p>{contractMetadata?.description}</p>
            </>
          ) : (
		  <div className={styles.loading}>
		  <Spinner size='md' />
          </div>
          )}
          <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
        </div>

        {!isLoading ? (
          <div className={styles.nftBoxGrid}>
            {listings
              ?.filter((listing) => listing.type === filter)
              ?.map((listing) => (
                <Link
                  className={styles.nftBox}
                  key={listing.id.toString()}
                  href={`/listing/${listing.id}`}
                >
			<Card maxW='sm' overflow='hidden'>
                  <ThirdwebNftMedia
                    metadata={{ ...listing.asset }}
                    className={styles.nftMedia}
                  />
				<CardBody style={{padding: '15px'}}>
                  <h4>{listing.asset.name}</h4>
  </CardBody>
  <Divider />
  <CardFooter style={{padding: '10px'}}>
                  <p>
                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
  </CardFooter>
</Card>
                </Link>
              ))}
          </div>
        ) : (
          <><div className={styles.loading}>
		  <Spinner
			  thickness='4px'
			  speed='0.65s'
			  emptyColor='gray.200'
			  color='blue.500'
			  size='xl' />
          </div>
		  </>
        )}
      </div>
    </Container>
  );
}
