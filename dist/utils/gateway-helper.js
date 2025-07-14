"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stokenetGateway = exports.mainnetGateway = void 0;
const gateway_ez_mode_1 = require("@rippy/gateway-ez-mode");
const babylon_gateway_api_sdk_1 = require("@radixdlt/babylon-gateway-api-sdk");
const gatewayApi = babylon_gateway_api_sdk_1.GatewayApiClient.initialize({
    networkId: babylon_gateway_api_sdk_1.RadixNetwork.Mainnet,
    applicationName: "Radix CLI helper",
    applicationVersion: "1.0.0",
    applicationDappDefinitionAddress: "account_rdx12y4l35lh2543nfa9pyyzvsh64ssu0dv6fq20gg8suslwmjvkylejgj",
});
const gatewayApiStokenet = babylon_gateway_api_sdk_1.GatewayApiClient.initialize({
    networkId: babylon_gateway_api_sdk_1.RadixNetwork.Stokenet,
    applicationName: "Radix CLI helper",
    applicationVersion: "1.0.0",
    applicationDappDefinitionAddress: "account_tdx_2_12yvxwkrcgu2spp9u66d8j8uvzk97ra749qdsgdaacm8lwnvpd8srxa",
});
exports.mainnetGateway = new gateway_ez_mode_1.GatewayEzMode(gatewayApi);
exports.stokenetGateway = new gateway_ez_mode_1.GatewayEzMode(gatewayApiStokenet);
//# sourceMappingURL=gateway-helper.js.map