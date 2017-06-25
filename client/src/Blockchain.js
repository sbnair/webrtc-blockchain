import Wallet from './Wallet.js';
import RTC from './RTC.js';
import Support from './Support.js';

const walletIds = {};
const peerIds = {};

const onRTC = event => {
  switch (event.type) {
    case 'dataChannelOpen':
      RTC.send(event.id, { type: 'walletIdRequest' });
      break;

    case 'dataChannelClose':
      delete peerIds[event.id];
      Object.keys(walletIds)
        .filter(walletId => walletIds[walletId] === event.id)
        .forEach(walletId => {
          delete walletIds[walletId];
        });
      break;

    case 'message':
      const { from, data } = event.message;
      switch (data.type) {
        case 'transaction':
          break;

        case 'walletIdRequest':
          Wallet.getId().then(walletId => (
            RTC.send(from, { type: 'walletIdResponse', walletId })
          ));
          break;

        case 'walletIdResponse':
          peerIds[from] = data.walletId;
          walletIds[data.walletId] = from;
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
};

const init = () => {
  if (!Support.canCrypto() || !Support.canStorage()) {
    throw new Error('Unsupported browser. This app requires crypto.subtle and localStorage');
  }

  // Generate a new wallet or import from localStorage as soon as the page loads
  Wallet.getId().then(() => {
    RTC.init();
    RTC.listen(onRTC);
  });
};

const addTransaction = transaction => {
  RTC.broadcast({ type: 'transaction', transaction });
};

export default { init, addTransaction };
