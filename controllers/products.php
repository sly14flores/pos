<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("products");

switch ($_GET['r']) {
	
	case "list":
	
	$sql = "SELECT * FROM products";
	$products = $con->getData($sql);
	
	echo json_encode($products);
	
	break;
	
	case "save":
		
	$_POST['product_date'] = date("Y-m-d",strtotime($_POST['product_date']));
	
	if ($_POST['product_id'] == 0) {
		unset($_POST['product_id']);
		$product = $con->insertData($_POST);
	} else {
		$product = $con->updateData($_POST,'product_id');
	}
	
	break;
	
	case "edit":
	
	$sql = "SELECT * FROM products WHERE product_id = $_POST[product_id]";
	$product = $con->getData($sql);
	
	echo json_encode($product[0]);	
	
	break;
	
	case "delete":
	
	$delete = $con->deleteData(array("product_id"=>implode(",",$_POST['product_id'])));
	
	break;
	
}

?>