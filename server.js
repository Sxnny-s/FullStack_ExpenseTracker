if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const PORT = 8888
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initPassport = require('./passport')


initPassport(
    passport, 
    email => User.findOne({email}),
    id => User.findById(id)
)


app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false

    }
))

mongoose.connect(process.env.url, {
    useUnifiedTopology: true
})
.then(() => console.log('Database Connected...'))
.catch((err) => console.error('MongoDB connection error:', err))



// model and Schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
        type: String,
        required:true,
    }
}) 

const expenseSchema = new mongoose.Schema({
    
    description: {
        type: String,
        required: true,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        require: true
    }, 
    date: {
        type: Date,
        default: Date.now()
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Expense = mongoose.model('Expense', expenseSchema)


const User = mongoose.model('User', userSchema)

module.exports = {User, exports}

// Auth

app.use(passport.initialize())
app.use(passport.session())


// render index.ejs / Dashboard
app.get('/', checkAuth, async (req,res) => {

    try {
        const recentExpenses = await Expense.find({userId: req.user._id})
        .sort( {date: -1})
        .limit(5)
        
        res.render('index.ejs', {
            name: req.user.name,
            recentExpenses
        })
    }catch (err) {
        console.error('Error displaying expenses:', err)
        res.status(500).send('Error fetching expenses');
    }
})



// login routes

app.get('/login', checkNotAuth, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuth, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Register post Request and render


app.get('/register', checkNotAuth, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuth, async (req, res) => {
    
    const {name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.redirect('/login')
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
        const newUser = new User ({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save()
        
        res.redirect('/login');
    } catch (err) {
        console.error(error)
    }
})


// check Auth function 

function checkAuth(req,res, next){
    if(req.isAuthenticated()){
        return next()
    }
    
    res.redirect('/login')
}

function checkNotAuth(req,res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    
    next()
}

//Expense Routes

//  render form to add new expenses

app.get('/expenses/new', checkAuth, async (req,res) => {
    res.render('expenses/new.ejs', )
})

// render all expenses ejs

app.get('/expenses/all', checkAuth, async (req,res) => {

    // Finds all Expenses with tied to the users ID  
    
    const recentExpenses = await Expense.find({userId: req.user._id})
    .sort( {date: -1})
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

    const start = await Expense.findOne({userId: req.user._id}).sort({date: 1})

    let formattedDate;

    if(start != null){
        formattedDate = new Date(start.date).toLocaleDateString()
    }else{
        formattedDate = "NO transactions"
    }

    res.render('expenses/all.ejs', {
        formattedDate,
        recentExpenses
    } )
})


// saving expenses to the DB
app.post('/expenses', checkAuth, async (req, res) => {
    const {description, amount, category} = req.body
    
    
    // making expense object form the Expense model
    const newExpense = new Expense({
        description,
        amount,
        category,
        userId: req.user._id
    });

    // adding form data to mongoDB
    try {
        await newExpense.save();
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.redirect('/expenses/new')
    }

})

// Logout route

app.post('/logout', (req, res) => {
    
    // destroy the session 
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed! please try again...')
        }
    })

    res.redirect('/login')
})

// Delete request

app.delete('/expense/delete/:id', checkAuth, async (req, res) => {
    
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).send('Deleted Successfully')
    } catch (error) {
        res.status(500).send('Server request failed, Error Deleting')
    }
    
})






app.listen(PORT, () => {
    console.log(`BIG TONKA SERVER LIVE! http://localhost:${PORT}`)
})

