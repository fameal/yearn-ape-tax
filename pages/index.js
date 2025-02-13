import React, { useMemo } from "react";
import Head from "next/head";
import styled from "styled-components";

import Connect from "../components/Connect";
import VaultLink from "../components/VaultLink";
import Warning from "../components/Warning";
import { Page } from "../components/Layout";

import { useWeb3 } from "../helpers/web3";
import { useKonami } from "../helpers/konami";
import { measures } from "../helpers/measures";

import vaults from "../vaults.json";

const Types = styled.div`
  display: flex;
  max-width: ${measures.max};
  div {
    flex-grow: 1;
  }
  div:last-child {
    flex-shrink: 1;
  }
`;

const Column = styled.div`
  margin: 0 2rem 0 0;
  @media screen and (max-width: ${measures.phone}) {
    display: block;
    margin: 0 1rem 0 0;
  }
`;

export default function Home() {
  const { connected, chainId } = useWeb3();
  const { activated } = useKonami();
  const vaultsByType = useMemo(() => {
    if (connected && chainId) {
      const all = Object.values(vaults).filter(
        (vault) => vault.chainId === chainId
      );
      const types = all.reduce((types, item) => {
        const type = types[item.type] || [];
        type.push(item);
        types[item.type] = type;
        return types;
      }, {});
      console.log(types);
      return Object.entries(types);
    } else {
      [];
    }
  }, [connected, chainId]);
  return (
    <Page>
      <Head>
        <title>Experimental Experiments</title>
      </Head>
      <h1>Experimental experiment registry</h1>
      <Connect />
      <hr />
      <Warning>
        this experiments are experimental. They are extremely risky and will
        probably be discarded when the test is over. There's a good chance that
        you can lose your funds. If you choose to proceed, do it with extreme
        caution.
      </Warning>
      {connected && chainId && (
        <Types>
          {vaultsByType.map(([type, vaults]) => (
            <Column key={type}>
              <h3>{type}</h3>
              {vaults.map((vault) => (
                <VaultLink key={vault.id} vault={vault} />
              ))}
            </Column>
          ))}
        </Types>
      )}
      {activated && <h1>MONKE</h1>}
      {!connected && <h5>connect your wallet...</h5>}
    </Page>
  );
}
