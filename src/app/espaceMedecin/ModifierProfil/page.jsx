"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import FeatherIcon from "feather-icons-react";
import Sidebar from "../../../components/espaceMedecin/Sidebar1";
// import { getMedecinById, updateMedecin } from "../../../services/medecinService";
import { Profileuser, cameraicon } from "../../../components/espaceMedecin/imagepath";
import "../../../assets/css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const MonProfile = () => {
  const [medecin, setMedecin] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('access-token');
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    specialite: "",
    sexe: "",
    about: "",
    mail: "",
    password: "",
    confirmPassword: "",
    estGeneraliste: false,
    estMedcinESJ: false,
    linkedin: "",
    cin: "",
    inpe: "",
    ppr: "",
    medicalStudies: [{ annee: "", diplome: "", institut: "" }]
  });
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
    fetchMedecin();
  }, [user && user.claims.id]);

  const getMedecinData = (id) => {
    axios.get('http://localhost:8080/medecins/' + 2, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setMedecin(res.data);
      setFormData({
        prenom: res.data?.prenom,
        nom: res.data?.nom,
        cin: res.data?.cin,
        inpe: res.data?.inpe,
        ppr: res.data?.ppr,
        specialite: res.data?.specialite,
        mail: res.data?.mail,
        sexe: res.data?.sexe,
        linkedin: res.data?.linkedin,
        about: res.data?.about,
        password: res.data?.password,
        estGeneraliste: res.data?.estGeneraliste,
        estMedcinESJ: res.data?.estMedcinESJ,
        medicalStudies: res.data?.medicalStudies || [{ annee: "", diplome: "", institut: "" }],
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducations = [...formData.medicalStudies];
    updatedEducations[index][name] = value;
    setFormData({ ...formData, medicalStudies: updatedEducations });
  };

  const addEducationField = () => {
    setFormData(prevState => ({
      ...prevState,
      medicalStudies: [...prevState.medicalStudies, { annee: "", diplome: "", institut: "" }]
    }));
  };
  
  const removeEducationField = (index) => {
    const updatedEducations = formData.medicalStudies.filter((_, i) => i !== index);
    setFormData({ ...formData, medicalStudies: updatedEducations });
  };  

  const updateMedecin = (id, medecinData) => {
    console.log(medecinData);
    axios.patch(
      `http://localhost:8080/medecins/${id}`,
      medecinData,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      }
    )
    .then(response => {
      if (response.status === 200) {
        console.log(response.data);
      } else {
        throw new Error("Failed to update medecin data");
      }
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  };  

  const fetchMedecin = () => {
    try {
      setLoading(true);
      getMedecinData(user && user.claims.id);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch medecin data", error);
      toast.error("Failed to fetch medecin data.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    const { prenom, nom, mail, password, confirmPassword } = formData;
    if (!prenom || !nom || !mail) {
      toast.error("Prénom, Nom, and Email are required.");
      return false;
    }
    if (password && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const updateData = { ...formData };
      delete updateData.confirmPassword;
      if (!formData.password) {
        delete updateData.password;
      }
      updateMedecin(user && user.claims.id, updateData);
      toast.success("Profile updated successfully!");
      setLoading(true);
    } catch (error) {
      console.error("Failed to update medecin data", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Sidebar
        id="menu-item1"
        id1="menu-items1"
        activeClassName="doctorprofile"
      />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="doctors.html">Medecins</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Profil Medecin</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="about-info">
                        <h4>
                          Profil du Docteur
                          {/* <span>
                            <Link href="#">
                              <i className="feather-more-vertical">
                                <FeatherIcon icon="more-vertical" />
                              </i>
                            </Link>
                          </span> */}
                        </h4>
                      </div>
                      <div className="doctor-profile-head">
                        <div className="row">
                          <div className="profile-user-box">
                            <div className="profile-user-img">
                              <img
                                src={previewUrl || Profileuser.src}
                                alt="Profile"
                              />{" "}
                              <div className="form-group doctor-up-files profile-edit-icon mb-0">
                                <div className="uplod d-flex">
                                  <label className="file-upload profile-upbtn mb-0">
                                    <img src={cameraicon.src} alt="Profile" />
                                    <input
                                      type="file"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="names-profiles">
                              <h4>
                                {medecin?.prenom} {medecin?.nom}
                              </h4>
                              <h5>{medecin?.specialite}</h5>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "15px",
                                justifyContent: "flex-end",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {/* LinkedIn Link */}
                                <a
                                  className="btn"
                                  href={formData.linkedin}
                                  style={{
                                    borderColor: "transparent",
                                    color: "black",
                                    padding: "6px 12px",
                                    fontSize: "14px",
                                    backgroundColor: "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                  }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div
                                    className="personal-icons"
                                    style={{ marginRight: "8px" }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faLinkedin}
                                      style={{
                                        color: "#0077B5",
                                        fontSize: "24px",
                                      }}
                                    />
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12 mt-4">
                            <div className="form-group">
                              <label>À propos de moi</label>
                              <textarea
                                className="form-control"
                                name="about"
                                rows="4"
                                value={formData.about || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Prénom</label>
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                name="prenom"
                                value={formData.prenom || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Nom</label>
                              <input
                                disabled
                                type="text"
                                className="form-control"
                                name="nom"
                                value={formData.nom || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Spécialité</label>
                              <input
                                type="text"
                                className="form-control"
                                name="specialite"
                                value={formData.specialite || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Sexe</label>
                              <select
                                className="form-control"
                                name="sexe"
                                value={formData.sexe || ""}
                                onChange={handleInputChange}
                              >
                                <option value="M">Homme</option>
                                <option value="F">Femme</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Email</label>
                              <input
                                type="email"
                                className="form-control"
                                name="mail"
                                value={formData.mail || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>CIN</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cin"
                                value={formData.cin || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>PPR</label>
                              <input
                                type="text"
                                className="form-control"
                                name="ppr"
                                value={formData.ppr || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>INPE</label>
                              <input
                                type="text"
                                className="form-control"
                                name="inpe"
                                value={formData.inpe || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Mot de passe</label>
                              <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="********"
                                value={formData.password || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Confirmer le mot de passe</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="********"
                                name="confirmPassword"
                                value={formData.confirmPassword || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>LinkedIn</label>
                              <input
                                type="text"
                                className="form-control"
                                name="linkedin"
                                value={formData.linkedin || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12 mt-4">
                            <label>Education</label>
                            {formData.medicalStudies.map((education, index) => (
                              <div key={index} className="form-group row">
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="annee"
                                    placeholder="Année"
                                    value={education.annee}
                                    onChange={(e) => handleEducationChange(index, e)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="diplome"
                                    placeholder="Diplôme"
                                    value={education.diplome}
                                    onChange={(e) => handleEducationChange(index, e)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="institut"
                                    placeholder="Institut"
                                    value={education.institut}
                                    onChange={(e) => handleEducationChange(index, e)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <button type="button" onClick={() => removeEducationField(index)} className="btn btn-danger">
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button type="button" onClick={addEducationField} className="btn btn-secondary">
                              Add Education
                            </button>
                          </div>
                          <div className="col-12">
                            <div className="form-group form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="estGeneraliste"
                                name="estGeneraliste"
                                checked={formData.estGeneraliste}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="estGeneraliste"
                              >
                                Généraliste
                              </label>
                            </div>

                            <div className="form-group form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="estMedcinESJ"
                                name="estMedcinESJ"
                                checked={formData.estMedcinESJ}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="estMedcinESJ"
                              >
                                Médecin ESJ
                              </label>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Mettre à jour
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default MonProfile;
