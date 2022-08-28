func -SPA -o ./build/sft-wallet.fif stdlib.fc params.fc op-codes.fc sft-utils.fc sft-wallet.fc
echo '"build/sft-wallet.fif" include 2 boc+>B "build/sft-wallet.boc" B>file' | fift -s
func -SPA -o ./build/sft-minter.fif stdlib.fc params.fc op-codes.fc sft-utils.fc sft-minter.fc
func -SPA -o ./build/sft-collection-editable-code.fif stdlib.fc params.fc op-codes.fc sft-collection-editable.fc

fift -s build/print-hex.fif