import Table from "react-bootstrap/Table";
import { useUser } from "../context/UserContext";
import { Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { deleteTransactions } from "../../helpers/axiosHelper";
import { toast } from "react-toastify";

export const TransactionTable = () => {
  const [displyTran, setDisplayTran] = useState([]);
  const { transactions, toggleModal, getTransactions } = useUser();
  const [idsToDelete, setIdsToDelete] = useState([]);

  useEffect(() => {
    setDisplayTran(transactions);
  }, [transactions]);

  // const balance = displyTran.reduce((acc, t) => {
  //   return t.type === "income" ? acc + t.amount : acc - t.amount;
  // }, 0);

  const handleOnSearch = (e) => {
    const { value } = e.target;
    const filteredArg = transactions.filter(({ title }) => {
      return title.toLowerCase().includes(value.toLowerCase());
    });

    setDisplayTran(filteredArg);
  };

  const handleOnSelect = (e) => {
    const { checked, value } = e.target;
    console.log(checked, value);
    if (value === "all") {
      checked
        ? setIdsToDelete(displyTran.map((item) => item._id))
        : setIdsToDelete([]);

      return;
    }

    if (checked) {
      setIdsToDelete([...idsToDelete, value]);
    } else {
      setIdsToDelete(idsToDelete.filter((id) => id !== value));
    }
    return;
  };

  const handleOnDelete = async () => {
    if (
      confirm(
        `Are you sure you wnat to delete ${idsToDelete.length} transactions`
      )
    ) {
      const pending = deleteTransactions(idsToDelete);
      toast.promise(pending, {
        pending: "Please wait ....",
      });

      const { status, message } = await pending;
      toast[status](message);
      status === "success" && getTransactions() && setIdsToDelete([]);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between pt-3 mb-4">
        <div>{displyTran.length} transaction(s) found!</div>
        <div>
          <Form.Control type="text" onChange={handleOnSearch} />
        </div>
        <div>
          <Button onClick={() => toggleModal(true)}>
            <FaPlusCircle /> Add New Transaction
          </Button>
        </div>
      </div>
      <div>
        <Form.Check
          label="Select All"
          value="all"
          onChange={handleOnSelect}
          checked={displyTran.length === idsToDelete.length}
        />
      </div>
      <Table striped hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date </th>
            <th>Title</th>
            <th>Out </th>
            <th>In </th>
          </tr>
        </thead>
        <tbody>
          {displyTran.length > 0 &&
            displyTran.map((t, i) => (
              <tr key={t._id}>
                <td>{i + 1}</td>
                <td>
                  <Form.Check
                    label={t.createdAt.slice(0, 10)}
                    value={t._id}
                    onChange={handleOnSelect}
                    checked={idsToDelete.includes(t._id)}
                  />
                </td>
                <td>{t.title}</td>
                {t.type === "expenses" && (
                  <>
                    <td className="out">-${t.amount} </td>
                    <td> </td>
                  </>
                )}
                {t.type === "income" && (
                  <>
                    <td> </td>
                    <td className="in">${t.amount} </td>
                  </>
                )}
              </tr>
            ))}
          {/* <tr>
          <td>1</td>
          <td>20-3-2024</td>
          <td>Salary</td>
          <td> </td>
          <td>$ 3456 </td>
        </tr>
        <tr>
          <td>2</td>
          <td>20-3-2024</td>
          <td>Shopping</td>
          <td className="text-danger-important">$ -345 </td>
          <td> </td>
        </tr> */}
          {/* <tr>
          <td>3</td>
          <td>20-3-2024</td>
          <td>Found on the street</td>
          <td> </td>
          <td>$ 300 </td>
        </tr> */}

          <tr className="fw-bold text-end">
            <td colSpan={3}> Total Balance</td>

            <td colSpan={2}>
              $
              {displyTran.reduce((acc, t) => {
                return t.type === "income" ? acc + t.amount : acc - t.amount;
              }, 0)}{" "}
            </td>
          </tr>
        </tbody>
      </Table>
      {idsToDelete.length > 0 && (
        <div className="d-grid">
          <Button variant="danger" onClick={handleOnDelete}>
            Delete {idsToDelete.length} Transactions
          </Button>
        </div>
      )}
    </>
  );
};
