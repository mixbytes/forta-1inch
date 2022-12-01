const {
  FindingType,
  FindingSeverity,
  Finding,
  createTransactionEvent,
} = require("forta-agent");


const {
  handleTransaction,
  TARGET_ADDRESS,
  TARGET_FUNCTION,
} = require("./agent");

const { ethers } = require("hardhat")

async function getEventEmitter(atAddress) {
  const EventEmitter = await ethers.getContractFactory("EventEmitter")
  const eventEmitter = await EventEmitter.deploy()
  const eventEmitterCode = await ethers.provider.send("eth_getCode", [eventEmitter.address,]);
  await ethers.provider.send("hardhat_setCode", [atAddress, eventEmitterCode])
  return await ethers.getContractAt("EventEmitter", atAddress)
}

it("Correctly catch a router destroy() call", async () => {
  const eventEmitter = await getEventEmitter(TARGET_ADDRESS)

  const tx = await eventEmitter.destroy()
  const rx = await tx.wait()

  const txEvent = createTransactionEvent({
    transaction: tx,
    logs: rx.logs,
    block: {
      hash: tx.blockHash,
      number: tx.blockNumber,
      timestamp: Date.now(),
    },
  });
  const findings = await handleTransaction(txEvent);
  expect(findings.length).toBe(1)
})

it("Do not catch a destroy() on irrelevant contract", async () => {
  const eventEmitter = await getEventEmitter(ethers.Wallet.createRandom().address)

  const tx = await eventEmitter.destroy()
  const rx = await tx.wait()

  const txEvent = createTransactionEvent({
    transaction: tx,
    logs: rx.logs,
    block: {
      hash: tx.blockHash,
      number: tx.blockNumber,
      timestamp: Date.now(),
    },
  });
  const findings = await handleTransaction(txEvent);
  expect(findings.length).toBe(0)
})

