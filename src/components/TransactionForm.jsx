import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CustomInput } from "./CustomInput";
import useForm from "../hooks/useForm";
import { postNewTransaction } from "../../helpers/axiosHelper";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const initialState = {
  type: "",
  title: "",
  amount: "",
  tDate: "",
};

export const TransactionForm = () => {
  const { form, setForm, handleOnChange } = useForm(initialState);
  const { getTransactions, toggleModal } = useUser();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const pending = postNewTransaction(form);
    toast.promise(pending, {
      pending: "please wait ...",
    });
    const { status, message } = await pending;
    toast[status](message);
    if (status === "success") {
      setForm(initialState);
      //call the function to fetch all transaction
      getTransactions();

      //close the modal
      toggleModal(false);
    }
  };

  const fields = [
    {
      label: "Title",
      placeholder: "Salary",
      required: true,
      type: "text",
      name: "title",
      value: form.title,
    },
    {
      label: "Amount",
      placeholder: "44",
      required: true,
      type: "number",
      name: "amount",
      value: form.amount,
    },
    {
      label: "Transaction Date",

      required: true,
      type: "date",
      name: "tDate",
      value: form.tDate,
    },
  ];
  return (
    <div className="border rounded p-4">
      <h4 className="mb-5">Add your transaction!</h4>
      <Form onSubmit={handleOnSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Transaction type</Form.Label>
          <Form.Select name="type" onChange={handleOnChange} required>
            <option value="">-- select --</option>
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
          </Form.Select>
        </Form.Group>
        {fields.map((input) => (
          <CustomInput key={input.name} {...input} onChange={handleOnChange} />
        ))}

        <div className="d-grid">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
