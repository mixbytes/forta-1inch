contract EventEmitter {
    function destroy() external {
        selfdestruct(payable(msg.sender));
    }
}
