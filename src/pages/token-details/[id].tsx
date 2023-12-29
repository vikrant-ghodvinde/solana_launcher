import type { NextPage } from "next";
import { useRouter } from "next/router";
import { TokenDetailsView } from "views/tokenDetails";

const TokenDetails: NextPage = (props) => {
  const router = useRouter();
  const id = router.query;
  console.log(id);
  return (
    <TokenDetailsView />
  );
};

export default TokenDetails;