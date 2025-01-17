import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../constants/Navbar";
import Form from "../constants/Form";
import SaberContract from "../Data/SaberPump.json";

const Home: NextPage = () => {
  const ContractAddress: `0x${string}` =
    "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35";
  const abi = SaberContract.abi;

  return (
    <div>
      <Navbar />
      <Form ContractAddress={ContractAddress} abi={abi} />
    </div>
  );
};

export default Home;
