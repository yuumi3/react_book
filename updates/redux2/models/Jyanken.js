
const Jyanken = {
  random_hand: () => Math.floor(Math.random() * 3),
  judgment: (computer, human) => (computer - human + 3) % 3
}

export default Jyanken
