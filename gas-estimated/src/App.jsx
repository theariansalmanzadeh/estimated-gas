import { useEffect, useState } from "react";
import "./App.css";
import GasEsitmated from "./GasEsitmated";
import { ethers } from "ethers";
import abi from "./abi.json";

function App() {
  const [contract, setContract] = useState(null);
  const address = "0xB3b3075f947FAb91B338B36bd875F5E6463A3940";

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = await provider.getSigner();
      console.log(signer);
      const cont = new ethers.Contract(address, abi, signer);
      setContract(cont);
    })();
  }, []);

  return (
    <>
      <GasEsitmated contract={contract} />
    </>
  );
}

export default App;
