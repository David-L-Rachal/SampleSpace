const fs = require('fs');
const StringBuilder = require('string-builder');

// my file to parse
const myFile = "C:\\Users\\Grend\\Projects\\northstar\\stations_full.txt";
// file to send to sql
const newFile = "C:\\Users\\Grend\\Projects\\northstar\\stations.sql";
// field delemiter
const fd = "|";
// line delemiter
const ld = "\r\n";

const sb = new StringBuilder();

fs.readFile(myFile, 'utf-8', (err, data) => {
    var lines;
    var columns;
    var iLoop = 0;
    var iLineCount = 1;
    var iCharCount = 0;
    var iColumnCount = 0;
    var arrColumns = [1, 2, 3, 10, 11 ];
    var inColumn = false;
    //                                    (  1 ,     2,        3,      10,      11          )
    var sql_start = "insert into stations(calls, frequency, bc_service, city, stateName) values (ltrim(rtrim(";
    sb.append(sql_start);
    //for(; iLoop < )
    var stream = fs.createReadStream(myFile);
    var outPut = fs.createWriteStream(newFile);
    //outPut.setEncoding('UTF8');
    stream.setEncoding('UTF8');
    stream.on('data', function(chunk){
        for(iCharCount = 0; iCharCount < chunk.length; iCharCount++ ){

            if(chunk[iCharCount] == '\n'){
               sb.append(");\n");
               outPut.write(sb.toString(), 'UTF8');
               sb.clear();
               iColumnCount=0;
               sb.append(sql_start);
            }
            else if(chunk[iCharCount] == '|'){
              //sb.append("'");
              iColumnCount++;
              if(inColumn){
                sb.append("')) ");
              }
              if(arrColumns.includes(iColumnCount)){
                inColumn = true;
                if(iColumnCount > 1){
                  sb.append(", ltrim(rtrim('");
                }else{
                  sb.append("'");
                }
              }else{
                inColumn = false;
              }
            }
            else if (inColumn){
              if(chunk[iCharCount] == '\''){
                tempStr = chunk[iCharCount].replace("'", "''");
                sb.append(tempStr);
              }else{
                sb.append(chunk[iCharCount]);
              }
            }//END IFs
          //  iCharCount =0;
        }//END FOR LOOP
        ;
    });


})
