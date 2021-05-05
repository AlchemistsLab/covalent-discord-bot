require("dotenv").config();
const {Client} = require('discord.js');
// import axios from "axios";
const fetch = require('node-fetch');
const {RichEmbed} = require("discord.js");
const {MessageEmbed} = require("discord.js");


const client = new Client();

const PREFIX = "!";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});


// https://api.covalenthq.com/v1/1/address/0xE613Db0bfCd8FF9b45D7F043E1a6F0ca8677f97a/balances_v2/?nft=false&no-nft-fetch=true
client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME.toLowerCase() === 'balance') {
            if (args.length === 0) {
                return message.reply('Please provide an address !!');
            }
            try {
                const {data} = await fetch(`https://api.covalenthq.com/v1/1/address/${args[0]}/balances_v2/?nft=false&no-nft-fetch=true`).then(response => response.json());

                console.log(data.items)
                const embed = new MessageEmbed()
                    .setColor('#00D8D5')
                    .setColor('#FF4C8B')
                    .setTitle("Top Tokens in Your Wallet By Amount ")
                    .setFooter("- Made with ❤️ using Covalent APIs")
                    .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                    // .setThumbnail("https://i.ibb.co/yd4hYrz/covalent.png")
                    // .setThumbnail("https://i.ibb.co/VL2BLVm/siywpav2xzmfukum8jtc.png")
                    .setImage("https://i.ibb.co/P6NqFzd/Covalent-One-unified-API-One-billion-possibilities-22-43-08.png")
                    .setURL(`https://etherscan.io/address/${args[0]}`);

                let i = 0;
                let arr = [];
                let labels = [];
                for (const dataObj of data.items) {
                    const decimals = parseInt(dataObj.contract_decimals);
                    const balance = parseInt(dataObj.balance)
                    embed.addField("Token Name", `${dataObj.contract_name}`, true)
                    embed.addField("Price", `${dataObj.quote_rate}`, true)
                    // parseFloat(indexerStats.indexingRewardCut) / Math.pow(10, 4).toFixed(2);
                    embed.addField("Amount", `${(parseFloat(dataObj.balance) / Math.pow(10, decimals)).toFixed(2)}`, true)
                    // embed.addField("Balance", `${dataObj.quote}`, true)

                    embed.addField("\u200B", "\u200B")
                    embed.setDescription("```This shows Top 5 Tokens in Your Wallet```")

                    labels.push(dataObj.contract_name);
                    arr.push((parseFloat(dataObj.quote).toFixed(2)))
                    // console.log("labels",labels)
                    // console.log("arr",arr)
                    i++;
                    if (i === 5) {
                        break;
                    }


                }
                let sum = 0;
                for (const value of arr) {
                    sum = sum + parseFloat(value);
                }
                sum = sum.toFixed(2)
                console.log("sum", sum)

                //polarArea
                const chart = {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{data: arr}]
                        //     [{
                        //     label: 'Retweets',
                        //     data: [12, 5, 40, 5]
                        // }, {
                        //     label: 'Likes',
                        //     data: [80, 42, 215, 30]
                        // }]
                    },
                    options: {
                        plugins: {
                            datalabels: {
                                display: true,
                                backgroundColor: '#ccc',
                                borderRadius: 3,
                                font: {
                                    color: 'red',
                                    weight: 'bold',
                                }
                            },
                            doughnutlabel: {
                                labels: [{
                                    text: sum,
                                    font: {
                                        size: 20,
                                        weight: 'bold'
                                    }
                                }, {
                                    text: 'total'
                                }]
                            }
                        }
                    }
                }

                const encodedChart = encodeURIComponent(JSON.stringify(chart));
                const chartUrl = `https://quickchart.io/chart?bkg=white&c=${encodedChart}`;
                console.log("charurl", chartUrl)
                embed.setImage(chartUrl)


                message.channel.send(embed);
            } catch (e) {
                message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                console.log(e.toString());
            }
        } else if (CMD_NAME.toLowerCase() === 'price') {
            if (args.length === 0) {
                return message.reply('Please provide a Ticker !!');
            }

            try {
                const {data} = await fetch(`https://api.covalenthq.com/v1/pricing/tickers/?tickers=${args[0]}`).then(response => response.json());
                console.log(data)
                if (data.items.length <= 0) {
                    throw "Wrong Ticker";
                }

                console.log(data.items)
                const embed = new MessageEmbed()
                    .setColor('#00D8D5')
                    .setColor('#FF4C8B')
                    .setTitle(`Token Price for ${args[0]}`)
                    .setFooter("----------------------------------------------------------------------------------------- \n - Made with ❤️ using Covalent APIs")
                    .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                // .setImage("https://i.ibb.co/P6NqFzd/Covalent-One-unified-API-One-billion-possibilities-22-43-08.png")
                // .setURL(`https://etherscan.io/address/${args[0]}`);

                let i = 0;
                for (const dataObj of data.items) {
                    const decimals = parseInt(dataObj.contract_decimals);
                    const balance = parseInt(dataObj.balance)
                    embed.addField("Token Name", `${dataObj.contract_name}`, true)
                    embed.addField("Price", `${parseFloat(dataObj.quote_rate).toFixed(2)}`, true)
                    // parseFloat(indexerStats.indexingRewardCut) / Math.pow(10, 4).toFixed(2);
                    // embed.addField("Amount", `${(parseFloat(dataObj.balance) / Math.pow(10, decimals)).toFixed(2)}`, true)
                    if (i === 0) {
                        embed.setImage(dataObj.logo_url)

                    }
                    embed.addField("Rank", `${dataObj.rank}`, true)

                    embed.addField("\u200B", "\u200B")
                    i++;
                    if (i === 1) {
                        break;
                    }
                }
                message.channel.send(embed);
            } catch (e) {
                message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                console.log(e.toString());
            }

        } else if (CMD_NAME.toLowerCase() === 'holders') {

            // https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders_changes/?starting-block=11000
            //     https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders_changes/?starting-block=11000&ending-block=11383362

            // https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders/?page-size=1
            //     https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders/?block-height=100000&page-size=1


            if (args.length === 0) {
                return message.reply('Please provide a Contract Address !!');
            }

            if (args.length === 1) {
                try {
                    const {data} = await fetch(`https://api.covalenthq.com/v1/1/tokens/${args[0]}/token_holders/?page-size=1&key=ckey_c9f6b347ceee45a7afec8cbc264:`).then(response => response.json());
                    console.log(data)
                    if (data.items.length <= 0) {
                        throw "Wrong Ticker";
                    }

                    console.log(data.items)
                    const embed = new MessageEmbed()
                        .setColor('#00D8D5')
                        // .setColor('#FF4C8B')
                        .setTitle(`Count of Token Holders for ${data.items[0].contract_name} At The Latest Block Height`)
                        .setFooter("- Made with ❤️ using Covalent APIs")
                        .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")

                    let i = 0;
                    for (const dataObj of data.items) {
                        const decimals = parseInt(dataObj.contract_decimals);
                        const balance = parseInt(dataObj.balance)
                        embed.addField("Block Height", `${dataObj.block_height}`, true)
                        embed.addField("Token Name", `${dataObj.contract_name}`, true)
                        embed.addField("Total Count", `${data.pagination.total_count}`, true)
                        if (i === 0) {
                            embed.setImage(dataObj.logo_url)

                        }

                        embed.addField("\u200B", "\u200B")
                        i++;
                        if (i === 1) {
                            break;
                        }
                    }

                    message.channel.send(embed);
                    //uncomment this line if you want to tag that user !!
                    //   return message.reply(embed)
                } catch (e) {
                    message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                    console.log(e.toString());
                }
            } else if (args.length === 2) {
                try {
                    const {data} = await fetch(`https://api.covalenthq.com/v1/1/tokens/${args[0]}/token_holders/?block-height=${args[1]}&page-size=1&key=ckey_c9f6b347ceee45a7afec8cbc264:`).then(response => response.json());
                    console.log(data)
                    if (data.items.length <= 0) {
                        throw "Wrong Ticker";
                    }

                    console.log(data.items)
                    const embed = new MessageEmbed()
                        .setColor('#00D8D5')
                        // .setColor('#FF4C8B')
                        .setTitle(`Count of Token Holders for ${data.items[0].contract_name} At The Given Block Height`)
                        .setFooter("- Made with ❤️ using Covalent APIs")
                        .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")

                    let i = 0;
                    for (const dataObj of data.items) {
                        const decimals = parseInt(dataObj.contract_decimals);
                        const balance = parseInt(dataObj.balance)
                        embed.addField("Block Height", `${dataObj.block_height}`, true)
                        embed.addField("Token Name", `${dataObj.contract_name}`, true)
                        embed.addField("Total Count", `${data.pagination.total_count}`, true)
                        if (i === 0) {
                            embed.setImage(dataObj.logo_url)

                        }

                        embed.addField("\u200B", "\u200B")
                        i++;
                        if (i === 1) {
                            break;
                        }
                    }

                    message.channel.send(embed);
                } catch (e) {
                    message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                    console.log(e.toString());
                }
            } else {
                message.channel.send("Invalid number of Arguments, Use `!help` to check for the correct syntax");
            }


        } else if (CMD_NAME.toLowerCase() === 'portfolio') {


            if (args.length === 0) {
                return message.reply('Please provide a Contract Address !!');
            }


            try {
                const {items} = await fetch(`https://api.covalenthq.com/v1/1/address/${args[0]}/portfolio_v2/?`).then(response => response.json());
                console.log(items)

                console.log(items)
                if (items.length <= 0) {
                    throw "Wrong Ticker";
                }

                // const embed = new MessageEmbed()
                //     .setColor('#00D8D5')
                //     .setColor('#FF4C8B')
                //     .setTitle("Top Tokens in Your Wallet By Amount ")
                //     .setFooter("- Made with ❤️ using Covalent APIs")
                //     // .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                //     .setImage("https://i.ibb.co/P6NqFzd/Covalent-One-unified-API-One-billion-possibilities-22-43-08.png")
                //     .setURL(`https://etherscan.io/address/${args[0]}`);

                let i = 0;
                let dataset = []
                for (const dataObj of items) {


                    let j = 0;
                    let arr = []
                    for (const holdings of dataObj.holdings) {
                        arr.push(parseFloat(holdings.high.quote))
                        j++
                        if (j === 7) {
                            break;
                        }
                    }


                    arr.reverse()
                    dataset.push({
                        label: dataObj.contract_name,
                        data: arr
                    })

                    i++;
                    if (i === 5) {
                        break;
                    }


                    // // const decimals = parseInt(dataObj.contract_decimals);
                    // // const balance = parseInt(dataObj.balance)
                    // embed.addField("Token Name", `${dataObj.contract_name}`, true)
                    // embed.addField("Price", `${dataObj.quote_rate}`, true)
                    // // parseFloat(indexerStats.indexingRewardCut) / Math.pow(10, 4).toFixed(2);
                    // embed.addField("Amount", `${(parseFloat(dataObj.balance) / Math.pow(10, decimals)).toFixed(2)}`, true)
                    // // embed.addField("Balance", `${dataObj.quote}`, true)
                    //
                    // embed.addField("\u200B", "\u200B")
                    // i++;
                    // if (i === 5) {
                    //     break;
                    // }
                }
                const chart = {
                    type: 'line',
                    data: {
                        labels: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Today',],
                        datasets: dataset
                        //     [{
                        //     label: 'Retweets',
                        //     data: [12, 5, 40, 5]
                        // }, {
                        //     label: 'Likes',
                        //     data: [80, 42, 215, 30]
                        // }]
                    }
                }

                const encodedChart = encodeURIComponent(JSON.stringify(chart));
                const chartUrl = `https://quickchart.io/chart?bkg=white&c=${encodedChart}`;

                const embed = new MessageEmbed()
                    // .setColor('#00D8D5')
                    .setColor('#FF4C8B')
                    .setDescription("```This shows your balance in USD for Top 5 Tokens over the span of last 7 days```")
                    .setTitle(`Your Portfolio Over Last 7 Days`)
                    // .setFooter("------------------- Made with ❤️ using Covalent APIs", "https://s4.gifyu.com/images/flip_1.gif")
                    .setFooter("- Made with ❤️ using Covalent APIs")
                    .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                    .setImage(chartUrl)

                // message.channel.send(embed);
                return message.reply(embed)
            } catch (e) {
                message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                console.log(e.toString());
            }


        } else if (CMD_NAME.toLowerCase() === 'diff') {
            let url = "";

            if (args.length === 0) {
                return message.reply('Please provide a Contract Address !!');
            } else if (args.length === 1) {
                return message.channel.send("Invalid number of Arguments, Use `!help` to check for the correct syntax");

            } else if (args.length === 2) {
                url = `https://api.covalenthq.com/v1/1/tokens/${args[0]}/token_holders_changes/?starting-block=${args[1]}&page-size=10000&key=ckey_c9f6b347ceee45a7afec8cbc264:`
            } else if (args.length === 3) {
                url = `https://api.covalenthq.com/v1/1/tokens/${args[0]}/token_holders_changes/?starting-block=${args[1]}&ending-block=${args[2]}&page-size=10000&key=ckey_c9f6b347ceee45a7afec8cbc264:`
            } else {
                return message.channel.send("Invalid number of Arguments, Use `!help` to check for the correct syntax");
            }


            try {
                console.log("Calling API")
                var start = +new Date();
                const {data} = await fetch(url).then(response => response.json());
                var end = +new Date();
                var time = end - start;
                console.log('total execution time = '+ time + 'ms');

                console.log(data)
                if (data.items.length <= 0) {
                    return message.channel.send('No Change is observed between the block heights or Something wrong has happened, please check your inputs');
                    // throw "Wrong Ticker";
                }

                console.log(data.items)
                const embed = new MessageEmbed()
                    .setColor('#00D8D5')
                    // .setColor('#FF4C8B')
                    .setTitle(`Changes in Token Holders`)
                    .setFooter("- Made with ❤️ using Covalent APIs")
                    .setDescription(`*This shows the changes in the token holders between block heights for ${args[0]}*`)
                    .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                let sold = 0;
                let bought = 0;
                let same = 0;
                let total = data.items.length;

                let i = 0;
                for (const dataObj of data.items) {
                    const diff = parseInt(dataObj.diff);
                    if (diff < 0) {
                        sold++;
                    } else if (diff > 0) {
                        bought++
                    } else {
                        same++
                    }
                }

                let avgSold = parseFloat((sold * 100) / total).toFixed(2);
                let avgBought = parseFloat((bought * 100) / total).toFixed(2);
                let avgSame = parseFloat((same * 100) / total).toFixed(2);

                let labels = ['Avg % of People Who Sold', 'Avg % of People Who Bought', 'Avg % of People Who Didn\'t Change their Amount']
                let arr = [avgSold, avgBought, avgSame]
                embed.addField("Avg % of People Who Sold Some", avgSold)
                embed.addField("Avg % of People Who Bought Some", avgBought)
                embed.addField("Avg % of People Who Didn't Change their Amount", avgSame)


                //polarArea
                console.log("arr", arr)
                const chart = {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: arr,
                            backgroundColor: ['#FF0000', '#90EE90', '#add8e6']
                        }],
                    }
                }

                const encodedChart = encodeURIComponent(JSON.stringify(chart));
                const chartUrl = `https://quickchart.io/chart?bkg=white&c=${encodedChart}`;
                console.log("charurl", chartUrl)
                embed.setImage(chartUrl)


                message.channel.send(embed);
            } catch (e) {
                message.channel.send("A Problem occurred processing your request, please make sure your inputs are correct 😅 ");
                console.log(e.toString());
            }


            // https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders_changes/?starting-block=11000000&page-size=10000
            // https://api.covalenthq.com/v1/1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/token_holders_changes/?starting-block=11000000&ending-block=11383362&page-size=10000


        } else if (CMD_NAME.toLowerCase() === 'help') {

            const embed = new MessageEmbed()
                .setTitle("Here is How To Use Me !!")
                .setDescription("```Welcome ! You can use me to fetch data from covalent APIs \nPlease find the following commands:```")
                .setColor('#00D8D5')
                .setFooter("-------------------------------------------------------------------------------------------------------------" +
                    " \n - Made with ❤️ using Covalent APIs | Contact KingSuper For Any Issues or Help")
                // .setThumbnail("https://s4.gifyu.com/images/flip_1.gif")
                .setThumbnail("https://i.ibb.co/yd4hYrz/covalent.png")

                .addField("\u200B", "\u200B")

                .addField("1. ```!balance Your_Wallet_Address```", "This Command will fetch your top 5 Tokens by " +
                    "balance and plots a pie chart to visualize the data \n Eg: `!balance 0xE613Db0bfCd8FF9b45D7F043E1a6F0ca8677f97a`")

                .addField("\u200B", "\u200B")


                .addField("2. ```!holders Contract_Address```", "This Command will number of holders for that contract address " +
                    "at the current block height  \n Eg: `!holders 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984`")
                .addField("\u200B", "\u200B")


                .addField("3. ```!holders Contract_Address Block_Height```", "This Command will number of holders for that contract address " +
                    "at the given block height \n Eg: `!holders 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 12256964`")
                .addField("\u200B", "\u200B")


                .addField("4. ```!price TICKER```", "This Command will fetch price and market cap rank for the given ticker " +
                    "balance and plots a pie chart to visualize the data \n Eg: `!price UNI`")
                .addField("\u200B", "\u200B")


                .addField("5. ```!portfolio Your_Wallet_Address```", "This shows your balance in USD for Top 5 Tokens over the span of last 7 days" +
                    "\n Eg: `!portfolio 0xE613Db0bfCd8FF9b45D7F043E1a6F0ca8677f97a`")

                .addField("\u200B", "\u200B")

                .addField("6. ```!diff Contract_Address Block_Height_1```", "This shows the changes in the token holders between" +
                    " the given and current block height" +
                    "\n Eg: `!diff 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 11000000`")
                .addField("\u200B", "\u200B")

                .addField("7. ```!diff Contract_Address Block_Height_1 Block_Height_2```", "This shows the changes in the token holders between" +
                    " two block heights" +
                    "\n Eg: `!diff 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 11000000 12020000`")
                .addField("\u200B", "\u200B")

                .addField("8.```!help```", "Opens up the help section")

            message.channel.send(embed)
        } else {
            message.channel.send('Sorry ! But I don\'t know, what to say !')
        }
    }
});


client.login(process.env.DISCORDJS_BOT_TOKEN);
