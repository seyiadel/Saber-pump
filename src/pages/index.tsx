import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../constants/Navbar";
import Form from "../constants/Form";
import SaberContract from "../Data/SaberPump.json";

const Home: NextPage = () => {
  const ContractAddress: `0x${string}` =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const abi = SaberContract.abi;

  return (
    <div>
      <Navbar />
      <Form ContractAddress={ContractAddress} abi={abi} />
    </div>
  );
};

export default Home;
