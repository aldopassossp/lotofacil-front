// src/pages/HistoricoSugestoes.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Pagination,
  Stack,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import dayjs from "dayjs";
import historicoService, { HistoricoSugestao } from "../services/sugestao/historicoService";

interface PageResponse {
  content: HistoricoSugestao[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual (0-based)
}

/**
 * Página de Histórico de Sugestões (consome API paginada)
 */
const HistoricoSugestoes: React.FC = () => {
  // página (1-based para o componente Pagination), mas API usa 0-based
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageData, setPageData] = useState<PageResponse>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  // confirmação diálogo limpar/excluir
  const [openClearConfirm, setOpenClearConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const PAGE_SIZE = 5;

  // Carrega página (API é 0-based)
  const carregarPagina = async (pagina0Based: number) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await historicoService.listarHistorico(pagina0Based, PAGE_SIZE);
      // o backend pode retornar um AxiosResponse com data = Page<...>
      const dados = (resp && (resp as any).data) ? (resp as any).data : resp;
      // garante estrutura segura:
      const safe: PageResponse = {
        content: Array.isArray(dados?.content) ? dados.content : [],
        totalElements: typeof dados?.totalElements === "number" ? dados.totalElements : (Array.isArray(dados) ? dados.length : 0),
        totalPages: typeof dados?.totalPages === "number" ? dados.totalPages : (Array.isArray(dados) ? Math.ceil(dados.length / PAGE_SIZE) : 0),
        number: typeof dados?.number === "number" ? dados.number : pagina0Based,
      };
      setPageData(safe);
      setPageIndex(safe.number + 1); // manter sincronizado 1-based
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      setError("Erro ao carregar histórico.");
      setPageData({ content: [], totalElements: 0, totalPages: 0, number: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPagina(pageIndex - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Excluir registro
  const confirmarExcluir = (id: number) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const handleExcluir = async () => {
    if (deleteId == null) return;
    try {
      await historicoService.excluirRegistro(deleteId);
      setSnackbarMsg("Registro excluído com sucesso.");
      // recarrega a página corrente
      carregarPagina(pageIndex - 1);
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setSnackbarMsg("Erro ao excluir registro.");
    } finally {
      setOpenDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  // Limpar tudo
  const confirmarLimpar = () => setOpenClearConfirm(true);

  const handleLimpar = async () => {
    try {
      await historicoService.limparHistorico();
      setSnackbarMsg("Histórico limpo com sucesso.");
      // recarrega a primeira página
      carregarPagina(0);
    } catch (err) {
      console.error("Erro ao limpar:", err);
      setSnackbarMsg("Erro ao limpar histórico.");
    } finally {
      setOpenClearConfirm(false);
    }
  };

  // Exportar TODO o histórico (chama endpoint /todos)
  const handleExportarTudo = async () => {
    try {
      setLoading(true);
      const resp = await historicoService.listarTudo();
      const registros: HistoricoSugestao[] = (resp && (resp as any).data) ? (resp as any).data : resp;
      // build CSV
      const header = "ID;Números;Tipo;Acertos;Data de Criação\n";
      const rows = registros
        .map(
          (h) =>
            `${h.id};"${h.numeros}";${h.tipo};${h.acertos};${dayjs(h.dataCriacao).format("DD/MM/YYYY HH:mm")}`
        )
        .join("\n");
      const csv = header + rows;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "historico_sugestoes_tudo.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar tudo:", err);
      setSnackbarMsg("Erro ao exportar histórico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Histórico de Sugestões
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            startIcon={<CleaningServicesIcon />}
            onClick={confirmarLimpar}
            disabled={loading || pageData.totalElements === 0}
          >
            Limpar Histórico
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExportarTudo}
            disabled={loading || pageData.totalElements === 0}
          >
            Exportar tudo (CSV)
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : pageData.content.length === 0 ? (
        <Alert severity="info">Nenhuma sugestão salva no histórico.</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Números</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Pontos</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(pageData.content ?? []).map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.id}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {h.numeros}
                    </TableCell>
                    <TableCell>{h.tipo} números</TableCell>
                    <TableCell>{h.acertos ?? "-"} </TableCell>
                    <TableCell>
                      {h.dataCriacao ? dayjs(h.dataCriacao).format("DD/MM/YYYY HH:mm") : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" size="small" onClick={() => confirmarExcluir(h.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={Math.max(1, pageData.totalPages)}
              page={pageIndex}
              onChange={(_, value) => setPageIndex(value)}
              color="primary"
            />
          </Box>
        </Paper>
      )}

      {/* Dialogs */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle><WarningAmberIcon sx={{ mr: 1 }} /> Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente excluir este registro do histórico?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancelar</Button>
          <Button color="error" onClick={handleExcluir}>Excluir</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openClearConfirm} onClose={() => setOpenClearConfirm(false)}>
        <DialogTitle><WarningAmberIcon sx={{ mr: 1 }} /> Limpar histórico</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente limpar todo o histórico? Esta ação não pode ser desfeita.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearConfirm(false)}>Cancelar</Button>
          <Button color="error" onClick={handleLimpar}>Limpar tudo</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbarMsg} autoHideDuration={3500} onClose={() => setSnackbarMsg(null)} message={snackbarMsg || ""} />
    </Box>
  );
};

export default HistoricoSugestoes;
