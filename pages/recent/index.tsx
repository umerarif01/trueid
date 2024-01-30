import { useAccount } from "wagmi";
import { useIsMounted } from "../../hooks/useIsMounted";
import { SiteHeader } from "../../components/site-header";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RecentClaimedDegreesComponent from "../../components/recent-degrees";

const Page = () => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  if (!mounted) return;

  if (!address) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-col items-center justify-center mt-[150px]">
          <div className="flex flex-col space-y-4 items-center p-8 rounded-xl border border-gray-300 shadow-sm w-full md:w-2/6 dark:border-gray-700">
            <h1 className="font-semibold text-xl">
              Please Connect Your Wallet!
            </h1>
            <ConnectButton />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="container grid items-center pb-8 pt-6 md:py-10">
        <RecentClaimedDegreesComponent />
      </div>
    </>
  );
};

export default Page;
