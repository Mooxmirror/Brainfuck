/*

A small Brainfuck interpreter written in JavaScript.
(c) 2015 mooxmirror

*/

function interpret(code, input, max, binaryMode) {
    var currentIndex = 0, // current command index positionn
        currentChar = '', // currently selected character
        inputIndex = 0,  // input pointer position
        dataStorage = [0], // data storage array
        dataIndex = 0, // data pointer position
        output = '', // generated output
        iter = 0; // iterator for maximum iteration settings

    /* Finds the next loop start position for a given loop end x */
    var getLoopStart = function(code, current) {
        var lvl = 0,
            currentChar = '';
        for (var i = current - 1; i >= 0; i--) {
            currentChar = code.charAt(i);
            if (lvl == 0 && currentChar == '[')
                return i;
            else {
                if (currentChar == '[')
                    lvl--;
                if (currentChar == ']')
                    lvl++;
            }
        }
        return -1;
    };
    /* Finds the next loop end position for a given loop start x   */
    var getLoopEnd = function(code, current) {
        var lvl = 0,
            currentChar = '';
        for (var i = current + 1; i < code.length; i++) {
            currentChar = code.charAt(i);
            if (lvl == 0 && currentChar == ']')
                return i;
            else {
                if (currentChar == ']')
                    lvl--;
                if (currentChar == '[')
                    lvl++;
            }
        }
        return -1;
    };

    /* Parses binary data (01010101) to characters (numbers) */
    var binToChar = function(binaryData) {
        var short = binaryData.replace(/[^01]/g, ''), byteIndex = 0, genInput = '';

        if (short.length % 8 != 0) {
            throw "Valid character count is not a multiple of 8.";
        }
        for (byteIndex = 0; byteIndex < input.length; byteIndex += 8)  {
            genInput += String.fromCharCode(parseInt(short.substr(byteIndex, 8), 2));
        }

        return genInput;
    }
    /* Parses a string to a list of binary numbers seperated by line feeds */
    var charToBin = function(output) {
        var genOutput = '', byteSegment = '';

        for (byteIndex = 0; byteIndex < output.length; byteIndex += 1) {
            byteSegment = output.charCodeAt(byteIndex).toString(2);
            while (byteSegment.length < 8) byteSegment = '0' + byteSegment;
            genOutput += byteSegment + '\n';
        }

        return genOutput;
    }

    if (binaryMode) input = binToChar(input);

    code = code.replace(/[^<>,\.\[\]\+-]/g, '');

    for (currentIndex = 0; currentIndex < code.length; currentIndex++) {
        currentChar = code.charAt(currentIndex);

        switch (currentChar) {
            case '+':
                dataStorage[dataIndex] ++;
                break;
            case '-':
                dataStorage[dataIndex] --;
                break;
            case '>':
                dataIndex++;
                if (dataIndex == dataStorage.length)
                    dataStorage.push(0);
                break;
            case '<':
                dataIndex--;
                break;
            case '.':
                output += String.fromCharCode(dataStorage[dataIndex]);
                break;
            case ',':
                if (inputIndex == input.length)
                    dataStorage[dataIndex] = 0;
                else
                    dataStorage[dataIndex] = input.charCodeAt(inputIndex++);
                break;
            case '[':
                if (dataStorage[dataIndex] == 0)
                    currentIndex = getLoopEnd(code, currentIndex);
                break;
            case ']':
                if (dataStorage[dataIndex] != 0)
                    currentIndex = getLoopStart(code, currentIndex);
                break;
        }

        iter++;
        if (max > 0 && max < iter) return output;
    }

    if (binaryMode) output = charToBin(output);
    return output;
}
