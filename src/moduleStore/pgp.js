let openpgp = undefined;

const loadLibrary = async () => {
  /* eval(await (await fetch(`https://unpkg.com/openpgp@5.0.0-5/dist/openpgp.min.js`)).text());

  openpgp = window.openpgp;
  delete window.openpgp; */

  openpgp = eval((await (await fetch(`https://unpkg.com/openpgp@5.0.0-5/dist/lightweight/openpgp.min.mjs`)).text()).split('\n')[1].replace('export{', ';let ex={').replace(/([a-zA-Z_]*) as ([a-zA-Z_]*)/g, (_, actual, out) => `${out}: ${actual}`).slice(0, -1) + ';ex')
};

export const verifySignature = async (_publicKey, _signature, _original) => {
  if (!openpgp) await loadLibrary();

  const publicKey = await openpgp.readKey({ armoredKey: _publicKey });

  const message = await openpgp.createMessage({ text: _original });

  const signature = await openpgp.readSignature({
    armoredSignature: _signature // parse detached signature
  });

  const verificationResult = await openpgp.verify({
      message, // Message object
      signature,
      verificationKeys: publicKey
  });

  const { verified, keyID } = verificationResult.signatures[0];

  try {
      await verified; // throws on invalid signature

      goosemod.logger.debug('pgp', 'verified, key id:', keyID.toHex());
      return true;
  } catch (e) {
      goosemod.logger.debug('pgp', 'failed to verify', e.message);
      return false;
  }
};