import { GatewayEzMode } from "@rippy/gateway-ez-mode";

import {
  GatewayApiClient,
  RadixNetwork,
} from "@radixdlt/babylon-gateway-api-sdk";

const gatewayApi = GatewayApiClient.initialize({
  networkId: RadixNetwork.Mainnet,
  applicationName: "Radix CLI helper",
  applicationVersion: "1.0.0",
  applicationDappDefinitionAddress:
    "account_rdx12y4l35lh2543nfa9pyyzvsh64ssu0dv6fq20gg8suslwmjvkylejgj",
});

const gatewayApiStokenet = GatewayApiClient.initialize({
  networkId: RadixNetwork.Stokenet,
  applicationName: "Radix CLI helper",
  applicationVersion: "1.0.0",
  applicationDappDefinitionAddress:
    "account_tdx_2_12yvxwkrcgu2spp9u66d8j8uvzk97ra749qdsgdaacm8lwnvpd8srxa",
});

export const mainnetGateway = new GatewayEzMode(gatewayApi);

export const stokenetGateway = new GatewayEzMode(gatewayApiStokenet);
