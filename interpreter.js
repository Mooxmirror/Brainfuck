/*

A small Brainfuck interpreter written in JavaScript.
(c) 2015 mooxmirror

*/

function interpret(code, input, max) {
    var currentIndex = 0,
        currentChar = '',
        inputIndex = 0,
        dataStorage = [0],
        dataIndex = 0,
        output = '',
        iter = 0;

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
    return output;
}
