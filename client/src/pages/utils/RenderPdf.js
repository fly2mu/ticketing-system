import React from "react";
import { useLocation } from "react-router-dom";
import "./render.scss";
import moment from "moment-timezone";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RenderPdf() {
  const query = useQuery();
  const user = {
    userRequest: query.get("user"),
    department: query.get("department"),
    category: query.get("category").toLowerCase(),
    titleRequest: query.get("title"),
    subjekRequest: query.get("subjek"),
  };
  document.title = `Request-${moment().format("DD-MM-YYYY HH:mm:ss")}`;
  window.print();
  window.close();
  // html decacode for checked icon : &#128505;
  return (
    <>
      <div className="header-1">
        <h3>
          Form <br /> IT Service Request
        </h3>
      </div>

      <div className="wrap">
        <table border="1" cellPadding={0} cellSpacing className="table-pdf">
          <tbody>
            <tr className="tr-form-1">
              <td className="td-pdf" align="justify">
                Nama : <b>{user.userRequest}</b>
              </td>
              <td className="td-pdf" align="justify">
                Tanggal : <b>{moment().format("DD-MM-YYYY HH:mm")}</b>
              </td>
            </tr>
            <tr className="tr-form-1">
              <td className="td-pdf" align="justify">
                Department : <b>{user.department}</b>
              </td>
              <td className="td-pdf" align="justify">
                Kantor : <br /> &#9634; Kantor Pusat <br /> &#9634; Kantor
                Cabang: ..........
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="header-2">
        <h6>
          <b>Jenis Permintaan</b>
        </h6>
      </div>

      <div className="wrap">
        <table border="1" cellPadding={0} cellSpacing className="table-pdf">
          <tbody>
            <tr className="tr-form-1">
              <td className="td-pdf" align="justify">
                {user.category === "email" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                Email
              </td>
              <td className="td-pdf" align="justify">
                {user.category === "install software" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                Install Software
              </td>
            </tr>
            <tr className="tr-form-1">
              <td className="td-pdf" align="justify">
                {user.category === "internet access" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                Internet Access
              </td>
              <td className="td-pdf" align="justify">
                {user.category === "pc / laptop / printer" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                PC / Laptop / Printer
              </td>
            </tr>
            <tr className="tr-form-1">
              <td className="td-pdf" align="justify">
                {user.category === "care app" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                CARE App
              </td>
              <td className="td-pdf" align="justify">
                {user.category === "" ? (
                  <span>&#128505;</span>
                ) : (
                  <span>&#9634;</span>
                )}{" "}
                Lainya: ..........
              </td>
            </tr>
            <tr className="tr-form-1">
              <td className="td-pdf" align="center" colSpan={2}>
                Detail Permintaan
              </td>
            </tr>
            <tr className="tr-form-1">
              <td className="td-pdf detail" align="justify" colSpan={2}>
                <p>{moment().format("DD-MM-YYYY HH:mm")}</p>

                <h5>{user.titleRequest}</h5>

                <p>{user.subjekRequest}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="header-3">
        <p>
          Demikian form pengajuan IT Service Request ini di buat untuk
          sebagaimana mestinya.
        </p>
        <p className="underline">
          _____________________________/ _______/ _________
        </p>
      </div>

      <div className="wrap">
        <table border="1" cellPadding={0} cellSpacing className="table-pdf">
          <thead>
            <tr>
              <th className="th-pdf">Pemohon</th>
              <th className="th-pdf">
                Penanggung <br /> Jawab <br /> Pemohon
              </th>
              <th className="th-pdf">Head IT</th>
              <th className="th-pdf">IT Security</th>
              <th className="th-pdf">IT Support</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row-2">
              <td className="td-pdf"></td>
              <td className="td-pdf"></td>
              <td className="td-pdf"></td>
              <td className="td-pdf"></td>
              <td className="td-pdf"></td>
            </tr>
            <tr>
              <td className="ttd-name td-pdf">
                ................................. <br />
                (Nama Jelas)
              </td>
              <td className="ttd-name td-pdf">
                ................................. <br />
                (Nama Jelas)
              </td>
              <td className="ttd-name td-pdf">
                ................................. <br />
                (Nama Jelas)
              </td>
              <td className="ttd-name td-pdf">
                ................................. <br />
                (Nama Jelas)
              </td>
              <td className="ttd-name td-pdf">
                ................................. <br />
                (Nama Jelas)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
