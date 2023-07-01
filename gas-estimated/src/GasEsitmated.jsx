import React, { useState } from "react";
import { ethers } from "ethers";

function GasEsitmated(props) {
  const [alchemyFee, setAlchemyFee] = useState("");
  const [metamask, setMetamask] = useState("");

  const gasCostHandler = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const provider2 = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/Jpm-v9XHblo3Tx8n0TjK38jl__xOuoi_"
    );
    console.log(provider2);
    const fees = await provider.getFeeData();
    const feesAlchemy = await provider2.getFeeData();
    console.log(ethers.utils.formatEther(fees.maxFeePerGas));
    console.log("gas price", ethers.utils.formatEther(fees.maxFeePerGas));
    console.log(
      "base and priority",
      parseFloat(ethers.utils.formatEther(fees.maxPriorityFeePerGas)) +
        parseFloat(ethers.utils.formatEther(fees.lastBaseFeePerGas))
    );

    if (props.contract === null) return;

    const deadlinecalculator = async (deadline, provider) => {
      const timeStamp = (await provider.getBlock("latest")).timestamp;
      return timeStamp + deadline;
    };

    const timeout = deadlinecalculator(30 * 60, provider2);

    const tx2 = {
      tokenIn: "0x0000000000000000000000000000000000001010",
      tokenOut: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      amountIn: ethers.utils.parseUnits("0.1", 18),
      fee: 3000,
      isCoin: true,
      deadline: timeout,
      amountOutMinimum: BigInt(0),
      contractType: "UNISWAPV3",
    };

    console.log(props.contract);

    const { chainId } = await provider.getNetwork();
    console.log(chainId);

    const gasUsed = await props.contract.estimateGas.executeSwap(
      "0x0000000000000000000000000000000000001010",
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      ethers.utils.parseUnits("0.1", 18),
      3000,
      true,
      "UNISWAPV3",
      {
        value: ethers.utils.parseUnits("0.1", 18),
      }
    );

    const totalFee = 176352 * Number(fees.maxFeePerGas);
    const totalFeeAlchemy = 176352 * Number(feesAlchemy.maxFeePerGas);
    // Number(fees.maxFeePerGas) + Number(fees.lastBaseFeePerGas)); max
    console.log("///////////////////////////////////////////////");
    console.log(
      "Total estimated gas metamask :",
      ethers.utils.formatUnits(ethers.BigNumber.from(totalFee.toString()), 18)
    );
    console.log(
      "Total estimated gas Alchemy  :",
      ethers.utils.formatUnits(
        ethers.BigNumber.from(totalFeeAlchemy.toString()),
        18
      )
    );
    setAlchemyFee(
      ethers.utils.formatUnits(
        ethers.BigNumber.from(totalFeeAlchemy.toString()),
        18
      )
    );
    setMetamask(
      ethers.utils.formatUnits(ethers.BigNumber.from(totalFee.toString()), 18)
    );
  };

  return (
    <React.Fragment>
      <p>this button calculates a swap on the turboswap (uisng ethers)</p>
      <p>
        On the polygon blockchain at address
        `0xB3b3075f947FAb91B338B36bd875F5E6463A3940`
      </p>
      <div>
        <button onClick={gasCostHandler}>get fee</button>
        {alchemyFee.length > 0 && <p>Alchemy : {alchemyFee}</p>}
        {alchemyFee.length > 0 && <p>metamask : {metamask}</p>}
      </div>
    </React.Fragment>
  );
}

export default GasEsitmated;

// interface Iprops={
//   contract:ethers.contract
// }
