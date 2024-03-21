"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function getOutput(source_code, language, stdin) {
    const languageMap = {
        "C++": 52,
        "Python": 71,
        "Java": 62,
        "Javascript": 93,
    };
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            fields: '*',
            wait: "true"
        },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '70b819b38amsh48f59c77d66660fp156f6fjsnf9c1a6745681',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: language,
            source_code: source_code,
            stdin: stdin
        }
    };
    try {
        const response = await axios_1.default.request(options);
        console.log(response.data);
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = getOutput;
// getOutput("#include <iostream>\n using namespace std; \nint main() {\n  char name[10];\n  cin>>name;\n  cout<<name;\n  return 0;\n}", "C++", "Judge0");
getOutput("#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\n\", name);\n  return 0;\n}", "4", "Judge0");
