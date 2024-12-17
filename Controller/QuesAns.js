const Answer = require("../Schemas/Answers");
const Question = require("../Schemas/Questions")
const { v4: uuidv4 } = require('uuid');
const { Logger } = require('../Functions/Logger')


const getAllQues = async (req, res) => {
    try {
        console.log("get all Ques")
        const ques = await Question.scan().exec()
        res.json(ques)
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}
const getMyQues = async (req, res) => {
    try {
        console.log("get MY Ques")
        let ans = await Answer.scan('userId').eq(req.query.userid).attributes(['questionId', 'answer']).exec()
        let ques = await Question.scan("userRole").eq(req.params.id).exec()
        const map = new Map(ans.map(e => [e.questionId,e.answer]));
        ques = ques.map((e)=>{
            return {
                ...e,
                answer:map.get(e._id)
            }
        })
        res.json(ques)
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const getAllAns = async (req, res) => {
    try {
        console.log("All ans")
        const ques = await Answer.scan().exec()
        console.log({ ques })
        res.json({ ques })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const createQues = async (req, res) => {
    try {
        console.log("createQues")
        const _id = uuidv4()
        const ques = new Question({ ...req.body, _id })
        await ques.save()
        res.json(ques)
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}
const createAns = async (req, res) => {
    try {
        const ansArray = req.body.answers

        console.log({ ansArray }
        )
        const cron = await Promise.all(ansArray.map(async (e) => {
            // Check if an answer already exists for this user and question
            const existingAnswer = await Answer.scan("userId").eq(e.userId)
                .where("questionId").eq(e.questionId)
                .exec();

            if (existingAnswer.count > 0) {
                // console.log(`Answer already exists for user ${userId} and question ${questionId}`);
                return existingAnswer[0]; // Return existing answer or handle as needed
            }
            const userId = e.userId
            const questionId = e.questionId
            const answer = e.answer
            const _id = uuidv4()
            const ans = new Answer({ userId, questionId, answer, _id })
            await ans.save()
            return ans
        }))
        console.log({ cron })
        res.json(cron)
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}
const updateAns = async (req, res) => { res.send("updateAns") }


const deleQues = async (req, res) => {

    try {
        const del = await Question.delete(req.params.id)
        res.json({ message: "success" })

    } catch (error) {
        console.log({ error })
        res.json({ message: "error" })
    }
}
const getMyAns = async (req, res) => {
    console.log("thhis is my ans")
    const myAns = await Answer.scan('userId').eq(req.params.id).exec()
    const data = await Promise.all(myAns.map(async (e) => {
        try {
            const { question } = await Question.get(e.questionId)
            return { ...e, question }

        } catch (error) {
            return null
        }

    }))
    const filteredData = data.filter((e) => e != null)
    res.json(filteredData)
}


module.exports = { getAllQues, getMyQues, createAns, createQues, updateAns, deleQues, getAllAns, getMyAns }