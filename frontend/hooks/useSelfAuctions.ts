import { useState, useEffect } from "react";
import { Auction } from "@/types/auctionTypes";
import { AuctionSelfType } from "@/types/backendAuctionTypes";
import { fetchSelfAuctions } from "@/utils/fetchFunctions";
import { ErrorType } from "@/types/errorTypes";
import { User } from "@/types/userTypes";
import {
  allBiddingStatuses,
  determineTypeListings,
  getImageUrl
} from "@/utils/determineFunctions";

const useSelfAuctions = (
  type: AuctionSelfType,
  errorFcn: (error: ErrorType) => void,
  user: User,
  searchTerm: string,
  searchStatuses: string[],
  currentPage: number,
  pageSize: number
) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  useEffect(() => {
    if (type === "biddings" && searchStatuses.length === 0) {
      searchStatuses = allBiddingStatuses();
    }
    
    fetchSelfAuctions(
      errorFcn,
      type,
      user.accountId,
      searchTerm,
      searchStatuses,
      pageSize,
      currentPage
    ).then((auctionsGet) => {
      setTotalPages(Math.ceil(auctionsGet.totalNumAuctions / pageSize));
      setAuctions(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //TODO: set this type
        auctionsGet.auctions.map((auction: any) => {
          return {
              auctionId: auction.auctionId,
              name: auction.name,
              status: type === "biddings" ? auction.bidStatus : determineTypeListings(auction.auctionStatus, auction.endTime, auction.numBids),
              image: null,
              description: auction.description,
              topBid: auction.topBid ? auction.topBid.amount.toFixed(2): null,
              numberOfBids: auction.numBids,
              endDate: auction.endTime ? new Date(auction.endTime) : null,
              imageUrl: getImageUrl(auction)
            };

        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchStatuses, currentPage]);

  return { auctions, totalPages };
};

export default useSelfAuctions;
