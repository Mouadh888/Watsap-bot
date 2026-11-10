const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
        puppeteer: { headless: true, args: ['--no-sandbox'] }
        });

        let warnings = {};
        let spam = {};

        const badWords = ['سب', 'كلمة ممنوعة', 'رابط']; // ضيف كلماتك هون
        const activities = [
            "تحدي: ابعت آخر صورة عندك بالجاليري 😂",
                "سؤال: شو أكتر أكلة بتحبها؟",
                    "فعالية: مين بيقدر يجيب أطول كلمة؟",
                        "تحدي: غيّر اسمك لاسم فاكهة لمدة ساعة 🍌",
                            "سؤال ذكاء: شو الشي اللي بيطلع لفوق وما بينزل؟"
                            ];
                            const jokes = [
                                "ليش الكمبيوتر زعلان؟ لأنو انقطع عنو النت 😂",
                                    "واحد محشش راح عالمطعم، طلب صحن فارغ!",
                                        "شو قال القلم للورقة؟ انتي حياتي كلها!"
                                        ];

                                        client.on('qr', qr => qrcode.generate(qr, { small: true }));
                                        client.on('ready', () => console.log('البوت شغال ✅'));

                                        // 1. ترحيب بالعضو الجديد
                                        client.on('group_join', async (notification) => {
                                            const chat = await notification.getChat();
                                                const contact = await notification.getContact();
                                                    const name = contact.pushname || contact.number;
                                                        
                                                            await chat.sendMessage(`أهلا وسهلا فيك يا ${name} ❤️ نورّت جروبنا!\n\nاكتب !قوانين لتعرف القوانين\nواكتب !فعاليات لتشوف الفعاليات اليومية 🎉`);
                                                            });

                                                            // 2. مراقبة الرسائل والحماية
                                                            client.on('message', async (msg) => {
                                                                if (!msg.from.includes('@g.us')) return; // بس للجروبات
                                                                    const chat = await msg.getChat();
                                                                        const sender = msg.author || msg.from;
                                                                            const text = msg.body.toLowerCase();

                                                                                // حماية من الروابط
                                                                                    if (text.includes('chat.whatsapp.com') || text.includes('https://')) {
                                                                                            await msg.delete(true);
                                                                                                    await chat.sendMessage(`@${sender.split('@')[0]} ممنوع نشر روابط! تحذير 1/3`, { mentions: [sender] });
                                                                                                            return;
                                                                                                                }

                                                                                                                    // حماية من السب
                                                                                                                        if (badWords.some(w => text.includes(w))) {
                                                                                                                                warnings[sender] = (warnings[sender] || 0) + 1;
                                                                                                                                        await msg.delete(true);
                                                                                                                                                if (warnings[sender] >= 3) {
                                                                                                                                                            await chat.removeParticipants([sender]);
                                                                                                                                                                        await chat.sendMessage(`تم طرد العضو لمخالفة القوانين 3 مرات`);
                                                                                                                                                                                    warnings[sender] = 0;
                                                                                                                                                                                            } else {
                                                                                                                                                                                                        await chat.sendMessage(`تحذير ${warnings[sender]}/3 : ممنوع الكلام السيء`);
                                                                                                                                                                                                                }
                                                                                                                                                                                                                        return;
                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                // أوامر الفعاليات
                                                                                                                                                                                                                                    if (text === '!فعاليات' || text === '!فعالية') {
                                                                                                                                                                                                                                            await chat.sendMessage(`🎉 *فعاليات اليوم:*\n!سؤال - سؤال عشوائي\n!نكتة - نكتة تضحكك\n!تحدي - تحدي جديد\n!تصويت - سوي تصويت\n!قوانين - قوانين الجروب`);
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                    if (text === '!سؤال' || text === '!تحدي') {
                                                                                                                                                                                                                                                            const random = activities[Math.floor(Math.random() * activities.length)];
                                                                                                                                                                                                                                                                    await chat.sendMessage(`🎯 ${random}`);
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                            if (text === '!نكتة') {
                                                                                                                                                                                                                                                                                    const random = jokes[Math.floor(Math.random() * jokes.length)];
                                                                                                                                                                                                                                                                                            await chat.sendMessage(`😂 ${random}`);
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                    if (text === '!قوانين') {
                                                                                                                                                                                                                                                                                                            await chat.sendMessage(`📜 *قوانين الجروب:*\n1. ممنوع الروابط\n2. ممنوع السب\n3. ممنوع السبام\n4. احترم الكل\n3 تحذيرات = طرد`);
                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                client.initialize();