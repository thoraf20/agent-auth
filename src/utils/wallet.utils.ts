import axios from 'axios';

export class WalletService {
  static createWallet = async (agentId: string) => {
    const apiUrl = `${process.env.WALLET_SERVICE_BASE_URL}/wallets`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          agentId,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
      // Handle response
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };
}
