const { Finding, FindingSeverity, FindingType } = require("forta-agent");

const TARGET_ADDRESS = "0x1111111254EEB25477B68fb85Ed929f73A960582"
const TARGET_FUNCTION = "function destroy()"

const handleTransaction = async (txEvent) => {
  const findings = []

  const calls = txEvent.filterFunction(
    TARGET_FUNCTION,
    TARGET_ADDRESS
  );

  calls.forEach((call) => {
    findings.push(
      Finding.fromObject({
        name: "A call to 1inch router destroy() method",
        description: "A call to 1inch router destroy() method",
        alertId: "FORTA-1INCH-DESTROY",
        severity: FindingSeverity.High,
        type: FindingType.Exploit,
        metadata: {
        },
      })
    );
  });

  return findings;
};


module.exports = {
  handleTransaction,
  TARGET_ADDRESS,
  TARGET_FUNCTION,
};
