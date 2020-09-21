# await-then-loader

## About

This loader add 'then(null,callBack)' behind the await.
before
```
async function func() {
    let res = await new Promise(resolve => {
        setTimeout(() => {
            resolve('success')
        }, 3000)
    })
}
```
after
```
async function func() {
    let res = await new Promise(resolve => {
        setTimeout(() => {
            resolve('success')
        }, 3000)
    }).then(null,callback)
}
```

## Installation

npm install --save-dev await-then-loader

## Usage

```
module: {
    rules: [
        {
            test: /\.js$/,
            use:{
                loader:'await-then-loader',
                options:{
                  callback: (err) => {
                    console.log(err)
                  }
                }
            }
        }
    ]
}
```

## Options and Defaults (Optional)

```
{
    callback: (err) => {
      console.log(err)
    }
}
```
