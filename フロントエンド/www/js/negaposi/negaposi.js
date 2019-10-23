// This is a JavaScript file
//作成    var-a1.4.1(横山)
//最終編集var-a1.4.1(横山)

const getNegaposiValue = async function(text) {
  const response = await fetch('https://chatest.tk/dev?value=' + encodeURIComponent(text))
  .catch(function(err){
    console.log(err);
    return null;
  });
  if(response === null) return null;
  const data = await response.json();

  console.log( JSON.stringify(data) );

  const localValue = analyze(data.tokens);
  const value = localValue.score;

  return value;
};

const assignNegaposiValue = async function(text){
  
  const selectNegaposi = $("#jsi-emo").val();
  var tempNegapozi = await getNegaposiValue(text);
  if(selectNegaposi == 0){

    return tempNegapozi;

  }else if(selectNegaposi == 1){

    return Math.abs(tempNegapozi);

  }else if(selectNegaposi == -1){

    return Math.abs(tempNegapozi) * -1;

  }

}