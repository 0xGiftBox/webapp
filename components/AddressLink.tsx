import Link from "next/link";
import { Badge } from "@mantine/core";

const AddressLink = (props: { address: string }) => {
  const address = props.address;

  const getFormattedAddress = () => {
    return window?.tronWeb?.address.fromHex(address);
  };
  return (
    <Link
      className="link"
      href={`https://shasta.tronscan.org/#/address/${getFormattedAddress()}`}
      target="_blank"
      rel="noreferrer"
    >
      <Badge color="pink" variant="light">
        {
          // @ts-ignore
          getFormattedAddress().slice(0, 5) +
            "..." +
            getFormattedAddress().slice(-5)
        }
      </Badge>
    </Link>
  );
};

export default AddressLink;
