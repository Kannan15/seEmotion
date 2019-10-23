class Dictionary {
  data = [];

  constructor() {
    this.fetchData();
  }

  reFetchData() {
    localStorage.removeItem('Dict');
    this.fetchData();
  }

  async fetchData() {
    const localStrageData = localStorage.getItem('Dict');

    if(localStrageData === null) {
      alert("辞書ダウンロードを行います。");
      const response = await fetch('https://chatest.tk/dict');
      this.data = await response.json();
      this.reflectLocalStrage();
    }
    else {
      this.data = JSON.parse(localStrageData);
    }
  }

  setData(surface, reading, pos, rank, addition = false) {
    const wordIndex = this.data.findIndex((word) => word.reading === reading && word.pos === pos);

    if (addition && wordIndex !== -1) {
      rank += this.data[wordIndex].rank + rank;
      if (rank > 1) {
        rank = 1;
      }
      else if (rank < -1) {
        rank = -1;
      }
    }

    const word = {
      surface: surface,
      reading: reading,
      pos: pos,
      rank: Math.round(rank * 100) / 100
    };

    if (wordIndex !== -1) {
      this.data[wordIndex] = word;
    }
    else {
      this.data.push(word);
    }

    console.log(`Complete SetDict "${surface}" = ${rank}`);
  }

  reflectLocalStrage() {
    localStorage.setItem('Dict', JSON.stringify(this.data))
  }

  async setSentenceData(text, value) {
    const response = await fetch('https://chatest.tk/dev?value=' + text);
    const data = await response.json();
    const correction = 10;

    if (data.tokens.length > 1) {
      data.tokens.forEach((token) => {
        if (token.reading === undefined) {
          token.reading = token.surface_form
          token.basic_form = token.surface_form
        }

        const excludeWords = ['記号', '助動詞', '助詞'];

        if (excludeWords.indexOf(token.pos) === -1) {
          this.setData(token.basic_form, token.reading, token.pos, value / correction, true)
        }
      })
      this.reflectLocalStrage();
    }
  }
}
