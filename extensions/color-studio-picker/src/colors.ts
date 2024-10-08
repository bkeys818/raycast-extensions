const colors = {
  Basic: [
    { title: "White", color: "#ffffff" },
    { title: "Black", color: "#000000" },
  ],
  "Automattic Blue": [
    { title: "Automattic Blue 0", color: "#ebf4fa" },
    { title: "Automattic Blue 5", color: "#c4e2f5" },
    { title: "Automattic Blue 10", color: "#88ccf2" },
    { title: "Automattic Blue 20", color: "#5ab7e8" },
    { title: "Automattic Blue 30", color: "#24a3e0" },
    { title: "Automattic Blue 40", color: "#1490c7" },
    { title: "Automattic Blue 50", color: "#0277a8" },
    { title: "Automattic Blue 60", color: "#036085" },
    { title: "Automattic Blue 70", color: "#02506e" },
    { title: "Automattic Blue 80", color: "#02384d" },
    { title: "Automattic Blue 90", color: "#022836" },
    { title: "Automattic Blue 100", color: "#021b24" },
  ],
  Blue: [
    { title: "Blue 0", color: "#e9f0f5" },
    { title: "Blue 5", color: "#bbe0fa" },
    { title: "Blue 10", color: "#91caf2" },
    { title: "Blue 20", color: "#68b3e8" },
    { title: "Blue 30", color: "#399ce3" },
    { title: "Blue 40", color: "#1689db" },
    { title: "Blue 50", color: "#0675c4" },
    { title: "Blue 60", color: "#055d9c" },
    { title: "Blue 70", color: "#044b7a" },
    { title: "Blue 80", color: "#02395c" },
    { title: "Blue 90", color: "#01283d" },
    { title: "Blue 100", color: "#001621" },
  ],
  Celadon: [
    { title: "Celadon 0", color: "#e4f2ed" },
    { title: "Celadon 5", color: "#a7e8d3" },
    { title: "Celadon 10", color: "#66deb9" },
    { title: "Celadon 20", color: "#31cc9f" },
    { title: "Celadon 30", color: "#09b585" },
    { title: "Celadon 40", color: "#009e73" },
    { title: "Celadon 50", color: "#008763" },
    { title: "Celadon 60", color: "#007053" },
    { title: "Celadon 70", color: "#005c44" },
    { title: "Celadon 80", color: "#004533" },
    { title: "Celadon 90", color: "#003024" },
    { title: "Celadon 100", color: "#001c15" },
  ],
  Gray: [
    { title: "Gray 0", color: "#f6f7f7" },
    { title: "Gray 5", color: "#dcdcde" },
    { title: "Gray 10", color: "#c3c4c7" },
    { title: "Gray 20", color: "#a7aaad" },
    { title: "Gray 30", color: "#8c8f94" },
    { title: "Gray 40", color: "#787c82" },
    { title: "Gray 50", color: "#646970" },
    { title: "Gray 60", color: "#50575e" },
    { title: "Gray 70", color: "#3c434a" },
    { title: "Gray 80", color: "#2c3338" },
    { title: "Gray 90", color: "#1d2327" },
    { title: "Gray 100", color: "#101517" },
  ],
  Green: [
    { title: "Green 0", color: "#e6f2e8" },
    { title: "Green 5", color: "#b8e6bf" },
    { title: "Green 10", color: "#68de86" },
    { title: "Green 20", color: "#1ed15a" },
    { title: "Green 30", color: "#00ba37" },
    { title: "Green 40", color: "#00a32a" },
    { title: "Green 50", color: "#008a20" },
    { title: "Green 60", color: "#007017" },
    { title: "Green 70", color: "#005c12" },
    { title: "Green 80", color: "#00450c" },
    { title: "Green 90", color: "#003008" },
    { title: "Green 100", color: "#001c05" },
  ],
  "Jetpack Green": [
    { title: "Jetpack Green 0", color: "#f0f2eb" },
    { title: "Jetpack Green 5", color: "#d0e6b8" },
    { title: "Jetpack Green 10", color: "#9dd977" },
    { title: "Jetpack Green 20", color: "#64ca43" },
    { title: "Jetpack Green 30", color: "#2fb41f" },
    { title: "Jetpack Green 40", color: "#069e08" },
    { title: "Jetpack Green 50", color: "#008710" },
    { title: "Jetpack Green 60", color: "#007117" },
    { title: "Jetpack Green 70", color: "#005b18" },
    { title: "Jetpack Green 80", color: "#004515" },
    { title: "Jetpack Green 90", color: "#003010" },
    { title: "Jetpack Green 100", color: "#001c09" },
  ],
  Orange: [
    { title: "Orange 0", color: "#f5ece6" },
    { title: "Orange 5", color: "#f7dcc6" },
    { title: "Orange 10", color: "#ffbf86" },
    { title: "Orange 20", color: "#faa754" },
    { title: "Orange 30", color: "#e68b28" },
    { title: "Orange 40", color: "#d67709" },
    { title: "Orange 50", color: "#b26200" },
    { title: "Orange 60", color: "#8a4d00" },
    { title: "Orange 70", color: "#704000" },
    { title: "Orange 80", color: "#543100" },
    { title: "Orange 90", color: "#361f00" },
    { title: "Orange 100", color: "#1f1200" },
  ],
  Pink: [
    { title: "Pink 0", color: "#f5e9ed" },
    { title: "Pink 5", color: "#f2ceda" },
    { title: "Pink 10", color: "#f7a8c3" },
    { title: "Pink 20", color: "#f283aa" },
    { title: "Pink 30", color: "#eb6594" },
    { title: "Pink 40", color: "#e34c84" },
    { title: "Pink 50", color: "#c9356e" },
    { title: "Pink 60", color: "#ab235a" },
    { title: "Pink 70", color: "#8c1749" },
    { title: "Pink 80", color: "#700f3b" },
    { title: "Pink 90", color: "#4f092a" },
    { title: "Pink 100", color: "#260415" },
  ],
  Purple: [
    { title: "Purple 0", color: "#f2e9ed" },
    { title: "Purple 5", color: "#ebcee0" },
    { title: "Purple 10", color: "#e3afd5" },
    { title: "Purple 20", color: "#d48fc8" },
    { title: "Purple 30", color: "#c475bd" },
    { title: "Purple 40", color: "#b35eb1" },
    { title: "Purple 50", color: "#984a9c" },
    { title: "Purple 60", color: "#7c3982" },
    { title: "Purple 70", color: "#662c6e" },
    { title: "Purple 80", color: "#4d2054" },
    { title: "Purple 90", color: "#35163b" },
    { title: "Purple 100", color: "#1e0c21" },
  ],
  Red: [
    { title: "Red 0", color: "#f7ebec" },
    { title: "Red 5", color: "#facfd2" },
    { title: "Red 10", color: "#ffabaf" },
    { title: "Red 20", color: "#ff8085" },
    { title: "Red 30", color: "#f86368" },
    { title: "Red 40", color: "#e65054" },
    { title: "Red 50", color: "#d63638" },
    { title: "Red 60", color: "#b32d2e" },
    { title: "Red 70", color: "#8a2424" },
    { title: "Red 80", color: "#691c1c" },
    { title: "Red 90", color: "#451313" },
    { title: "Red 100", color: "#240a0a" },
  ],
  "Simplenote Blue": [
    { title: "Simplenote Blue 0", color: "#e9ecf5" },
    { title: "Simplenote Blue 5", color: "#ced9f2" },
    { title: "Simplenote Blue 10", color: "#abc1f5" },
    { title: "Simplenote Blue 20", color: "#84a4f0" },
    { title: "Simplenote Blue 30", color: "#618df2" },
    { title: "Simplenote Blue 40", color: "#4678eb" },
    { title: "Simplenote Blue 50", color: "#3361cc" },
    { title: "Simplenote Blue 60", color: "#1d4fc4" },
    { title: "Simplenote Blue 70", color: "#113ead" },
    { title: "Simplenote Blue 80", color: "#0d2f85" },
    { title: "Simplenote Blue 90", color: "#09205c" },
    { title: "Simplenote Blue 100", color: "#05102e" },
  ],
  "WooCommerce Purple": [
    { title: "WooCommerce Purple 0", color: "#f7edf7" },
    { title: "WooCommerce Purple 5", color: "#e5cfe8" },
    { title: "WooCommerce Purple 10", color: "#d6b4e0" },
    { title: "WooCommerce Purple 20", color: "#c792e0" },
    { title: "WooCommerce Purple 30", color: "#af7dd1" },
    { title: "WooCommerce Purple 40", color: "#9a69c7" },
    { title: "WooCommerce Purple 50", color: "#7f54b3" },
    { title: "WooCommerce Purple 60", color: "#674399" },
    { title: "WooCommerce Purple 70", color: "#533582" },
    { title: "WooCommerce Purple 80", color: "#3c2861" },
    { title: "WooCommerce Purple 90", color: "#271b3d" },
    { title: "WooCommerce Purple 100", color: "#140e1f" },
  ],
  "WordPress Blue": [
    { title: "WordPress Blue 0", color: "#fbfcfe" },
    { title: "WordPress Blue 5", color: "#f7f8fe" },
    { title: "WordPress Blue 10", color: "#d6ddf9" },
    { title: "WordPress Blue 20", color: "#adbaf3" },
    { title: "WordPress Blue 30", color: "#7b90ff" },
    { title: "WordPress Blue 40", color: "#546ff3" },
    { title: "WordPress Blue 50", color: "#3858e9" },
    { title: "WordPress Blue 60", color: "#2a46ce" },
    { title: "WordPress Blue 70", color: "#1d35b4" },
    { title: "WordPress Blue 80", color: "#1f3286" },
    { title: "WordPress Blue 90", color: "#14215a" },
    { title: "WordPress Blue 100", color: "#0a112d" },
  ],
  Yellow: [
    { title: "Yellow 0", color: "#f5f1e1" },
    { title: "Yellow 5", color: "#f5e6b3" },
    { title: "Yellow 10", color: "#f2d76b" },
    { title: "Yellow 20", color: "#f0c930" },
    { title: "Yellow 30", color: "#deb100" },
    { title: "Yellow 40", color: "#c08c00" },
    { title: "Yellow 50", color: "#9d6e00" },
    { title: "Yellow 60", color: "#7d5600" },
    { title: "Yellow 70", color: "#674600" },
    { title: "Yellow 80", color: "#4f3500" },
    { title: "Yellow 90", color: "#320" },
    { title: "Yellow 100", color: "#1c1300" },
  ],
};

export default colors;
