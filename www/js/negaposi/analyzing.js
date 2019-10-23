const posiNegaRatio = {
  posi: 5122,
  nega: 49983,
  zero: 20
};

const defaultOptions = {
  // 辞書にない単語のスコア
  unknownWordRank: 0,

  // ポジティブな単語に対する補正値(スコアに乗算)
  positiveCorrections: 1,

  // ネガティブな単語に対する補正値(スコアに乗算)
  // negativeCorrections: posiNegaRatio.posi / posiNegaRatio.nega,
  negativeCorrections: 1
};

// 辞書の配列
const Dict = new Dictionary;

const analyze = function (tokens) {
  const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (tokens.length === 0) {
    return 0;
  }
  var score = 0;
  let countUnknownWord = 0;
  const isKnownWord = []

  const unknownWordRank = options.unknownWordRank || defaultOptions.unknownWordRank;
  const posiNegaDict = Dict.data;
  const negativeCorrections = options.negativeCorrections || defaultOptions.negativeCorrections;
  const positiveCorrections = options.positiveCorrections || defaultOptions.positiveCorrections;

  const scoreToken = function scoreToken(token) {
    // まずは緩く取得
    const foundDictionaries = posiNegaDict.filter(function (dict) {
      if(!token["reading"]) token["reading"] = token["surface_form"];

      return ( dict["reading"] === token["reading"] ) && ( dict["posi"] === token["posi"] );
    });

    // 複数候補が出たときは厳しく判定
    const foundDict = foundDictionaries.length === 1 ? foundDictionaries[0]
                                                     : foundDictionaries.find(function (dict) {
      return dict["surface"] === token["basic_form"];
    });

    let rank;

    if ( foundDict ) {
      rank = foundDict["rank"];
      
      if ( rank > 0 ) rank *= positiveCorrections;
      if ( rank < 0 ) rank *= negativeCorrections;
    } else {
      ++countUnknownWord;

      rank = unknownWordRank;
    }

    return rank;
  };

  tokens.forEach(function (token) {
    console.log(token);
    const scoreCurrent = scoreToken(token);
    if( Array('記号', '助動詞', '助詞'). indexOf(token.pos) === -1)
      score += scoreCurrent;

    isKnownWord.push(scoreCurrent !== unknownWordRank)
  });

  const analyzeData = {
    score: score === 0 ? 0 : score / (tokens.length - countUnknownWord),
    isKnownWord: isKnownWord
  }

  return analyzeData;
};