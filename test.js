// JavaScript program to count occurrences
// of pat in txt.
let mod = 100000007;

function countFreq(pat, txt) {
    let M = pat.length;
    let N = txt.length;
    let res = 0;

    // A loop to slide pat[] one by one
    for (let i = 0; i <= N - M; i++) {
        // For current index i, check for
        // pattern match
        let j;
        for (j = 0; j < M; j++) {
            if (txt[i + j] != pat[j]) {
                break;
            }
        }

        // If pat[0...M-1] = txt[i, i+1, ...i+M-1]
        if (j == M) {
            res++;
            j = 0;
        }
    }
    return res;
}

// Driver Code
let txt = 'lololita lolololioa';
let pat = 'lol';

console.log(countFreq(pat, txt));

// This code is contributed by code_hunt
