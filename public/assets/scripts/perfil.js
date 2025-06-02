document.addEventListener("DOMContentLoaded", () => {
  const urlBase = "http://localhost:3000";

  const avatarPerfil = document.getElementById("avatarPerfil");
  const nomeUsuarioEl = document.getElementById("nomeUsuario");
  const descUsuarioEl = document.getElementById("descUsuario");
  const btnEditar = document.getElementById("editarUsuario");
  const popUpEditar = document.getElementById("pop-upEditar");
  const editForm = document.getElementById("editForm");
  const avatarInput = document.getElementById("avatarNovo");
  const previewAvatar = document.getElementById("previewAvatar");
  const btnSair = document.getElementById("sairDaConta");

  let usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  let avatarBase64 = usuarioLogado.avatar || "assets/images/defaultPFP.jpg";

  async function carregarPerfil(usuarioId) {
    try {
      const res = await fetch(`${urlBase}/usuarios/${usuarioId}`);
      if (!res.ok) throw new Error("Usuário não encontrado");
      const usuario = await res.json();

      usuarioLogado = usuario; 
      avatarBase64 = usuario.avatar || avatarBase64;

      if (avatarPerfil) avatarPerfil.src = usuario.avatar || avatarBase64;
      if (nomeUsuarioEl) nomeUsuarioEl.textContent = usuario.nome || "";
      if (descUsuarioEl) descUsuarioEl.textContent = usuario.desc || "";

    } catch (erro) {
      console.error("Erro ao carregar perfil:", erro);
    }
  }

  function abrirPopupEditar() {
    document.getElementById("username").value = usuarioLogado.nome || "";
    document.getElementById("des").value = usuarioLogado.desc || "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    previewAvatar.src = usuarioLogado.avatar || avatarBase64;

    popUpEditar.classList.remove("d-none");
    popUpEditar.classList.add("show");
  }

  function fecharPopupEditar() {
    popUpEditar.classList.remove("show");
    setTimeout(() => popUpEditar.classList.add("d-none"), 400);
  }

  async function atualizarPerfil(e) {
    e.preventDefault();

    const nome = document.getElementById("username").value.trim();
    const desc = document.getElementById("des").value.trim();
    const senha = document.getElementById("registerPassword").value.trim();
    const confirmar = document.getElementById("confirmPassword").value.trim();

    if (senha !== confirmar) {
      alert("As senhas não coincidem.");
      return;
    }

    const senhaAtualizada = senha.length > 0 ? senha : usuarioLogado.senha;

    const usuarioAtualizado = {
      ...usuarioLogado,
      nome,
      desc,
      senha: senhaAtualizada,
      avatar: avatarBase64,
    };

    try {
      const res = await fetch(`${urlBase}/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioAtualizado),
      });

      if (!res.ok) throw new Error("Erro ao Atualizar Perfil.");

      usuarioLogado = usuarioAtualizado;

      sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
      alert("Perfil Atualizado com Sucesso!");
      location.reload();
    } catch (erro) {
      console.error("Erro ao Salvar Perfil:", erro);
      alert("Falha ao Salvar Alterações.");
    }
  }

  function sairDaConta() {
    sessionStorage.removeItem("usuarioLogado");
    alert("Você Saiu da Conta.");
    window.location.href = "login.html";
  }

  if (btnEditar) btnEditar.addEventListener("click", abrirPopupEditar);

  if (popUpEditar) {
    popUpEditar.addEventListener("click", (e) => {
      if (e.target === popUpEditar) fecharPopupEditar();
    });
  }

  if (popUpEditar) {
    const editContainer = popUpEditar.querySelector(".edit-container");
    if (editContainer) {
      editContainer.addEventListener("click", (e) => e.stopPropagation());
    }
  }

  if (avatarInput) {
    avatarInput.addEventListener("change", () => {
      const file = avatarInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        avatarBase64 = reader.result;
        previewAvatar.src = avatarBase64;
      };
      reader.readAsDataURL(file);
    });
  }

  if (editForm) editForm.addEventListener("submit", atualizarPerfil);

  if (btnSair) btnSair.addEventListener("click", sairDaConta);

  carregarPerfil(usuarioLogado.id);
});