import React, { useEffect, useState } from "react";
import {
  Segment,
  Table,
  Pagination,
  Popup,
  Button,
  Modal,
} from "semantic-ui-react";
import "./styles.scss";
import axios from "axios";

function Home() {
  const [data, setData] = useState([]);
  const [dataItem, setDataItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [message, setMessage] = useState("");
  const SERVER = 'https://t-shoes-app.herokuapp.com/api/';

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAPI();
  }, []);

  const fetchAPI = () => {
    setLoading(true);
    axios
      .get(
        `${SERVER}getOrders?pageSize=24&pageNumber=1`
      )
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("Orders: ", data);
        setData(data.orders);
        setPageNumber(1);
        setTotalPage(data.totalPage);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        console.log(error);
      });
  };

  const handlePaginationChange = async (e, { activePage }) => {
    await setLoading(true);
    await setPageNumber(activePage);
    axios
      .get(
        `${SERVER}getOrders?pageSize=24&pageNumber=${activePage}`
      )
      .then(function (response) {
        // handle success
        const data = response.data;
        console.log("Orders: ", data);
        setData(data.orders);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        console.log(error);
      });
  };

  const onShowDetail = (item) => {
    setOpen(true);
    console.log(item);
    setDataItem(item);
    setSelectedStatus(item.orderStatus);
  };

  const onDelete = (productId) => {
    setLoading(true);
    axios
      .delete(
        `${SERVER}removeOrder/${productId}`
      )
      .then(function (response) {
        // handle success
        setLoading(false);
        setConfirmDialog(true);
        setMessage("???? x??a s???n ph???m kh???i danh s??ch ????n h??ng.");
        fetchAPI();
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        setConfirmDialog(true);
        setMessage("L???i. Kh??ng th??? x??a s???n ph???m kh???i danh s??ch ????n h??ng.");
        console.log(error);
      });
  };

  const handleSelectChange = (event) => {
    setSelectedStatus(parseInt(event.target.value));
    console.log(parseInt(event.target.value));
  };

  const onUpdateOrder = () => {
    setOpen(false);
    setLoading(true);
    axios
      .patch(
        `${SERVER}editOrderStatus/${dataItem._id}`,
        {
          orderStatus: selectedStatus,
        }
      )
      .then(function (response) {
        setConfirmDialog(true);
        setLoading(false);
        setMessage("C???p nh???t tr???ng th??i ????n h??ng th??nh c??ng!");
        console.log(response);
        fetchAPI();
      })
      .catch(function (error) {
        setConfirmDialog(true);
        setLoading(false);
        setMessage("C???p nh???t tr???ng th??i ????n h??ng kh??ng th??nh c??ng!");
        console.log(error);
      });
  };

  return (
    <div>
      <Segment loading={loading} className="order-container">
        <h3>Qu???n l?? ????n h??ng</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>T??n kh??ch h??ng</Table.HeaderCell>
              <Table.HeaderCell>T??n s???n ph???m</Table.HeaderCell>
              <Table.HeaderCell>Tr???ng th??i</Table.HeaderCell>
              <Table.HeaderCell>Ho???t ?????ng</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((item) => (
              <Table.Row>
                <Table.Cell>{item.customerName}</Table.Cell>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell
                  className={
                    item.orderStatus === 1
                      ? "case1"
                      : item.orderStatus === 2
                      ? "case2"
                      : item.orderStatus === 3
                      ? "case3"
                      : "case4"
                  }
                >
                  {item.orderStatus === 1
                    ? "V???a ?????t"
                    : item.orderStatus === 2
                    ? "??ang x??? l?? ????n h??ng"
                    : item.orderStatus === 3
                    ? "??ang giao h??ng"
                    : "???? nh???n h??ng"}
                </Table.Cell>
                <Table.Cell>
                  <Popup
                    content="Chi ti???t"
                    trigger={
                      <Button
                        icon="eye"
                        color="facebook"
                        circular
                        onClick={() => onShowDetail(item)}
                      />
                    }
                  />
                  <Popup
                    content="X??a"
                    trigger={
                      <Button
                        icon="trash alternate"
                        color="youtube"
                        circular
                        onClick={() => onDelete(item._id)}
                      />
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                <Pagination
                  boundaryRange={1}
                  showFirstAndLastNav={true}
                  showPreviousAndNextNav={true}
                  activePage={pageNumber}
                  ellipsisItem={true}
                  firstItem={true}
                  lastItem={true}
                  siblingRange={1}
                  totalPages={totalPage}
                  onPageChange={handlePaginationChange}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          <Modal.Header>
            <h5 className="txt-title">Th??ng tin ????n h??ng</h5>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <div className="info-check">
                <p>T??n kh??ch h??ng: {dataItem.customerName}</p>
              </div>
              <div className="info-check">
                <p>T??n s???n ph???m: {dataItem.productName}</p>
              </div>
              <div className="info-check">
                <p>Th????ng hi???u: {dataItem.productBrand}</p>
              </div>
              <div className="info-check">
                <p>S??? l?????ng: {dataItem.quantity}</p>
              </div>
              <div className="info-check">
                <p>S??? ??i???n tho???i: {dataItem.phone}</p>
              </div>
              <div className="info-check">
                <p>?????a ch??? nh???n h??ng: {dataItem.address}</p>
              </div>
              <div className="info-check">
                <p>Tr???ng th??i ????n h??ng:</p>
                <select
                  value={selectedStatus}
                  onChange={handleSelectChange}
                  className="select-status"
                >
                  <option value="1">V???a ?????t</option>
                  <option value="2">??ang x??? l?? ????n h??ng</option>
                  <option value="3">??ang giao h??ng</option>
                  <option value="4">???? nh???n h??ng</option>
                </select>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)}>H???y</Button>
            <Button onClick={() => onUpdateOrder()} positive>
              C???p nh???t
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          onClose={() => setConfirmDialog(false)}
          onOpen={() => setConfirmDialog(true)}
          open={confirmDialog}
          size="mini"
        >
          <Modal.Header>
            <h4 className="txt-check">Th??ng b??o</h4>
          </Modal.Header>
          <Modal.Content image>
            <p>{message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setConfirmDialog(false)}>????ng</Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    </div>
  );
}

export default Home;
