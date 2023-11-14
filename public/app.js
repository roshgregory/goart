import abi from './contractABI.js';
// const gasLimit = ethers.utils.parseUnits("100000", "wei"); 
document.addEventListener('DOMContentLoaded', () => {
    const connectWalletButton = document.getElementById('connectWallet');
    const mintForm = document.getElementById('mintForm');
    const nftDisplay = document.getElementById('nftDisplay');
    let provider;
    let signer;
    let contract;

    const contractAddress = '0x91ADc03F27BCa201A9AD3f0921679d62687805B3';

    connectWalletButton.addEventListener('click', async () => {
        // console.log("step 1");
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log("Triggering")
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                contract = new ethers.Contract(contractAddress, abi, signer);
                console.log('Wallet connected',contract);
                displayNFTs(); // Call displayNFTs after wallet connection
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        } else {
            console.log('Please install MetaMask!');
        }
    });

    mintForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tokenId = event.target.tokenId.value;
        const recipient = event.target.recipientAddress.value || await signer.getAddress();
        // console.log(tokenId,recipient);
        try {
            
            const tx = await contract.safeMint(recipient, tokenId);
            await tx.wait();
            console.log(`Minted token ID: ${tokenId} to ${recipient}`);
        } catch (error) {
            console.error('Error minting token:', error);
        }
    });
    
    async function displayNFTs() {
        nftDisplay.innerHTML = '';
        const address = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const nftCount = await contract.balanceOf(address);
        displayToken(nftCount);
    }
    

    function displayToken(nftCount) {
        const div = document.createElement('div');
        div.innerHTML = `<h3>Tokens owned: ${nftCount}</h3>`;
        const refreshButton = document.createElement('button');
        refreshButton.innerText = 'Refresh';
        refreshButton.addEventListener('click', () => {
            // Assuming you have a function to update the NFT count
            updateNFTCount();
        });
        div.appendChild(refreshButton);
        nftDisplay.appendChild(div);
    }


    async function updateNFTCount() {
        const address = await signer.getAddress();
        displayNFTs();
    }
});