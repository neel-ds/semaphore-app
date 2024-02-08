"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";

export default function Home() {
  const [trapdoor, setTrapdoor] = useState<BigInt>();
  const [nullifier, setNullifier] = useState<BigInt>();
  const [commitment, setCommitment] = useState<BigInt>();
  const [identity, setIdentity] = useState<Identity>();
  const [group, setGroup] = useState<Group>();

  const generateIdentity = () => {
    const { trapdoor, nullifier, commitment } = new Identity();
    setTrapdoor(trapdoor);
    setNullifier(nullifier);
    setCommitment(commitment);
  };

  const createGroup = async () => {
    const group = new Group(1);
    setGroup(group);
  };

  const generateProoOfMembership = async () => {
    const identity = await new Identity("far123");
    const group = await new Group(1);
    group.addMember(identity.commitment);
    const externalNullifier = group?.root;
    const signal = 1;

    const fullProof = await generateProof(
      identity,
      group,
      externalNullifier,
      signal,
      {
        zkeyFilePath: "./semaphore.zkey",
        wasmFilePath: "./semaphore.wasm",
      }
    );
    console.log("Full proof:", fullProof);
  };
  return (
    <main className="flex p-5 min-h-screen flex-col items-center justify-center gap-y-3">
      <h1 className="text-3xl font-bold text-amber-600 mb-5">Semaphore App</h1>
      <div className="inline-flex gap-x-3">
        <button
          onClick={generateIdentity}
          className="p-3 border border-amber-600 text-amber-600 font-bold hover:bg-amber-600 hover:text-white rounded-lg"
        >
          Generate Identity
        </button>
        <button
          onClick={createGroup}
          className="p-3 border border-emerald-600 text-emerald-600 font-bold hover:bg-emerald-600 hover:text-white rounded-lg"
        >
          Create Group
        </button>
        <button
          onClick={generateProoOfMembership}
          className="p-3 border border-violet-600 text-violet-600 font-bold hover:bg-violet-600 hover:text-white rounded-lg"
        >
          Generate Proof
        </button>
      </div>
      <p className="text-lg text-neutral-600">
        Trapdoor: {trapdoor?.toString()} <br /> Nullifier:{" "}
        {nullifier?.toString()} <br /> Commitment: {commitment?.toString()}
        <br /> Group:{group?.id.toString()}
        <br /> Identity: {identity?.toString()}
      </p>
    </main>
  );
}
