import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = () => {
    const expenses = [
        { id: 12344433, name: "Shopping", cost: 50 },
        { id: 12344433, name: "Holiday", cost: 300 },
        { id: 12344433, name: "Transportation", cost: 70 },
        { id: 12344433, name: "Fuel", cost: 50 },
        { id: 12344433, name: "Child Care", cost: 50 },
    ]

    return (
        <ul className='list-group'>
            {expenses.map((expense) => (
                <ExpenseItem
                    id={expense.id}
                    name={expense.name}
                    cost={expense.cost} />
            ))
            }
        </ul>
    )
}

export default ExpenseList;